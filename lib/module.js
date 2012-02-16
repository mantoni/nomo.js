/*
 * nomo.js
 *
 * Copyright (c) 2012 Maximilian Antoni <mail@maxantoni.de>
 * MIT Licensed
 */
var path  = require('path');
var fs    = require('fs');


function resolve(p, name) {
  var resolved = path.resolve(p, name);
  if (path.existsSync(resolved)) {
    return resolved;
  }
  return null;
}

function readPackageJson(p) {
  var packageJson = p + '/package.json';
  if (!path.existsSync(packageJson)) {
    throw new Error('No index.js nor package.json found in ' + p);
  }
  var json = fs.readFileSync(packageJson).toString();
  return JSON.parse(json);
}


function Module(p) {
  if (!p) {
    throw new TypeError('Missing path');
  }
  if (!path.existsSync(p)) {
    throw new Error('File not found: ' + p);
  }
  var stat = fs.statSync(p);
  if (stat.isDirectory()) {
    this.path = p;
    this.script = p + '/index.js';
    if (!path.existsSync(this.script)) {
      var pkg = readPackageJson(p);
      this.script = path.join(p, pkg.main);
      if (!path.existsSync(this.script)) {
        throw new Error('Main from package.json in ' + p + ' not found: ' +
          this.script);
      }
      this.nomo = pkg.nomo;
    }
  } else {
    this.path = path.dirname(p);
    this.script = p;
  }
  this.name = this.script.substring(0, this.script.length - 3);
}


Module.prototype.toString = function () {
  return fs.readFileSync(this.script).toString();
};


Module.prototype.resolve = function (name) {
  var p = this.path;
  var resolved = resolve(p, name) || resolve(p + '/node_modules', name);
  if (!resolved) {
    if (name.indexOf('.js') !== -1) {
      throw new Error('Cannot resolve script ' + name);
    }
    var s = name + '.js';
    resolved = resolve(p, s) || resolve(p + '/node_modules', s);
    if (!resolved) {
      throw new Error('Cannot resolve module ' + name);
    }
  }
  var relativePath = path.relative(p, resolved);
  return path.join(p, relativePath);
};


module.exports = function (p) {
  return new Module(p);
};
