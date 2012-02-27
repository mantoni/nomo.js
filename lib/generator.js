/*
 * nomo.js
 *
 * Copyright (c) 2012 Maximilian Antoni <mail@maxantoni.de>
 * MIT Licensed
 */
var mod       = require('./module');
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
  var self = this;
  m.eachRequire(function (name) {
    var resolved = m.resolve(name);
    var required = mod.create(resolved);
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
  if (config.require) {
    if (config.exportTarget) {
      init = config.exportTarget + ' = ';
    }
    init += 'require(\'' + config.require + '\');\n';
  }
  if (config.requireTarget) {
    init += config.requireTarget + ' = require;\n';
  }

  return template.
    replace('{{version}}', version).
    replace('{{modules}}', map).
    replace('{{init}}', indent(init, '  '));
};


Generator.prototype.writeScript = function (fileName) {
  var script = this.toString();
  fs.writeFileSync(fileName || 'nomo.js', script);
};


module.exports = function (config) {
  return new Generator(config);
};
