/*
 * nomo.js
 *
 * Copyright (c) 2012 Maximilian Antoni <mail@maxantoni.de>
 * MIT Licensed
 */
var fs        = require('fs');

var path      = require.resolve('../lib/template');
var template  = fs.readFileSync(path).toString();
var pkg       = JSON.parse(fs.readFileSync(__dirname + '/../package.json'));
var version   = pkg.version;

function indent(script, indentation) {
  return script.replace(/^/gm, indentation);
}

function Generator(config) {
  this.modules = {};
  this.config = config || {};
  if (this.config.exportRequire && !this.config.requireTarget) {
    this.config.requireTarget = 'window.require';
  }
}

Generator.prototype.add = function (name, script) {
  var indented = indent(script, '  ');
  this.modules[name] = 'function (module, exports) {\n' + indented + '\n}';
  return this;
};

Generator.prototype.has = function (name) {
  return this.modules.hasOwnProperty(name);
};

Generator.prototype.toString = function () {
  var scripts = [];
  for (var name in this.modules) {
    var script = this.modules[name];
    scripts.push('\'' + name + '\': ' + script.replace(/[\s]+$/m, ''));
  }
  var map = '{\n' + indent(scripts.join(',\n'), '    ') + '\n  }';
  var init = '';
  var config = this.config;
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

module.exports = function (config) {
  return new Generator(config);
};
