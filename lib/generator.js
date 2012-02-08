var script    = require('./script');
var fs        = require('fs');

var path      = require.resolve('../lib/template');
var template  = fs.readFileSync(path).toString();


function Generator() {
  this.modules = {};
}

Generator.prototype.add = function (name, code) {
  this.modules[name] = code;
  return this;
};

Generator.prototype.toString = function () {
  var hash = [];
  for (var name in this.modules) {
    var code = this.modules[name];
    var wrapped = script(code).indent().wrap().toString();
    hash.push('\'' + name + '\': ' + wrapped);
  }
  return template.replace('{{modules}}', '{\n' + hash.join(',\n') + '\n  }');
};

module.exports = function () {
  return new Generator();
};
