var path = require('path');
var fs = require('fs');

function Module(p) {
  if (!p) {
    throw new TypeError('Missing path');
  }
  if (!path.existsSync(p)) {
    throw new Error('File not found: ' + p);
  }
  var stat = fs.statSync(p);
  if (stat.isDirectory()) {
    this.script = p + '/index.js';
    if (!path.existsSync(this.script)) {
      var packageJson = p + '/package.json';
      if (!path.existsSync(packageJson)) {
        throw new Error('No index.js nor package.json found in ' + p);
      }
      var json = fs.readFileSync(packageJson).toString();
      var pkg = JSON.parse(json);
      this.script = p + '/' + pkg.main;
      if (!path.existsSync(this.script)) {
        throw new Error('Main from package.json in ' + p + ' not found: ' +
          this.script);
      }
    }
  } else {
    this.script = p;
  }
  this.path = p;
}

Module.prototype.resolve = function (name) {
  if (name.indexOf('.js') === -1) {
    name = name + '.js';
  }
  var resolved = path.resolve(this.path, name);
  if (!path.existsSync(resolved)) {
    resolved = path.resolve(this.path + '/node_modules', name);
    if (!path.existsSync(resolved)) {
      throw new Error('Cannot resolve module ' + name);
    }
  }
  return path.relative(this.path, resolved);
};

module.exports = function (path) {
  return new Module(path);
};
