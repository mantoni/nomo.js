var path = require('path');
var vm = require('vm');

function Module(p) {
  this.path = process.cwd();
  if (p) {
    this.path = path.resolve(this.path, p);
  }
}

Module.prototype.resolve = function (name) {
  var fullName = name.indexOf('.js') === -1 ? name + '.js' : name;
  var normalizedPath = path.normalize(fullName);
  var resolved = path.resolve(this.path, normalizedPath);
  if (!path.existsSync(resolved)) {
    resolved = path.resolve(this.path + '/node_modules', normalizedPath);
    if (!path.existsSync(resolved)) {
      throw new Error('Cannot resolve module ' + normalizedPath);
    }
  }
  var relative = path.relative(this.path, resolved);
  return relative;
};

module.exports = function (path) {
  return new Module(path);
};
