var path = require('path');

function Module(p) {
  this.path = process.cwd();
  if (p) {
    this.path = path.resolve(this.path, p);
  }
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
