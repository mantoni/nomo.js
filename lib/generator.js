/*
 * nomo.js
 *
 * Copyright (c) 2012 Maximilian Antoni <mail@maxantoni.de>
 * MIT Licensed
 */
var module    = require('./module');
var fs        = require('fs');

var path      = require.resolve('../lib/template');
var template  = fs.readFileSync(path).toString();
var pkg       = JSON.parse(fs.readFileSync(__dirname + '/../package.json'));
var version   = pkg.version;


function indent(script, indentation) {
  return script.replace(/^/gm, indentation);
}


function moduleMap(modules) {
  var scripts = [];
  for (var name in modules) {
    var script  = modules[name];
    var trimmed = script.replace(/[\s]+$/m, '');
    scripts.push('\'' + name + '\': ' + trimmed);
  }
  var pairs = scripts.join(',\n');
  return '{\n' + indent(pairs, '    ') + '\n  }';
}


function Generator(config) {
  this.modules  = {};
  this.config   = config || {};

  if (this.config.exportRequire && !this.config.requireTarget) {
    this.config.requireTarget = 'window.require';
  }
}


Generator.prototype.add = function (m) {
  if (this.modules.hasOwnProperty(m.name)) {
    return;
  }
  var self = this;
  m.eachRequire(function (name) {
    var resolved = m.resolve(name);
    var required = module.create(resolved);
    self.add(required);
    return required.name;
  });
  var s = indent(m.toString(), '  ');
  this.modules[m.name] = 'function (module, exports) {\n' + s + '\n}';
};


Generator.prototype.has = function (name) {
  return this.modules.hasOwnProperty(name);
};


Generator.prototype.toString = function () {
  var map     = moduleMap(this.modules);
  var init    = '';
  var config  = this.config;
  var pkg     = config.pkg;
  if (config.require) {
    if (config.exportTarget) {
      init = config.exportTarget + ' = ';
    }
    init += 'require(\'' + config.require + '\');\n';
  }
  if (config.requireTarget) {
    init += config.requireTarget + ' = require;\n';
  }

  var title = config.name || pkg.name;
  if (pkg.version) {
    title += ' v' + pkg.version;
  }
  if (pkg.homepage) {
    title += ' ' + pkg.homepage;
  }

  return template.
    replace('{{title}}'   , title).
    replace('{{version}}' , version).
    replace('{{modules}}' , map).
    replace('{{init}}'    , indent(init, '  '));
};


Generator.prototype.writeScript = function (fileName) {
  var script = this.toString();
  if (fileName) {
    fs.writeFileSync(fileName, script);
  } else {
    process.stdout.write(script);
  }
};


exports.create = function (config) {
  return new Generator(config);
};

exports.Generator = Generator;
