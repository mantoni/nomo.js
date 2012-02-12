/*
 * nomo.js
 *
 * Copyright (c) 2012 Maximilian Antoni <mail@maxantoni.de>
 * MIT Licensed
 */
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
      this.script = path.join(p, pkg.main);
      if (!path.existsSync(this.script)) {
        throw new Error('Main from package.json in ' + p + ' not found: ' +
          this.script);
      }
    }
    this.path = p;
  } else {
    this.script = p;
    this.path = path.dirname(p);
  }
}

Module.prototype.readScript = function () {
  return fs.readFileSync(this.script).toString();
};

function resolve(p, name) {
  var resolved = path.resolve(p, name);
  if (path.existsSync(resolved)) {
    return resolved;
  }
  resolved = path.resolve(p + '/node_modules', name);
  if (path.existsSync(resolved)) {
    return resolved;
  }
  return null;
}

Module.prototype.resolve = function (name) {
  var resolved = resolve(this.path, name);
  if (!resolved) {
    if (name.indexOf('.js') !== -1) {
      throw new Error('Cannot resolve script ' + name);
    }
    resolved = resolve(this.path, name + '.js');
    if (!resolved) {
      throw new Error('Cannot resolve module ' + name);
    }
  }
  return path.join(this.path, path.relative(this.path, resolved));
};

module.exports = function (p) {
  return new Module(p);
};
