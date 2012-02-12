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

function indent(script) {
  return script.replace(/^/gm, '  ');
}

function Generator() {
  this.modules = {};
}

Generator.prototype.add = function (name, script) {
  var indented = indent(script);
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
    scripts.push('\'' + name + '\': ' + script);
  }
  var map = '{\n' + scripts.join(', ') + '\n}';
  return template.replace('{{version}}', version).replace('{{modules}}', map);
};

module.exports = function () {
  return new Generator();
};
