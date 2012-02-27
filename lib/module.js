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


function Module(config) {
  this.path   = config.path;
  this.script = config.script;
  this.nomo   = config.nomo;
  this.name   = this.script.substring(0, this.script.length - 3);
}


Module.prototype.toString = function () {
  if (typeof this.source === 'undefined') {
    this.source = fs.readFileSync(this.script).toString();
  }
  return this.source;
};


Module.prototype.eachRequire = function (fn) {
  this.source = this.toString().replace(/require\(("[^"]+"|'[^']+')\)/g,
    function (match, group) {
      var quote       = group.substring(0, 1);
      var name        = group.substring(1, group.length - 1);
      var replacement = fn(name);
      return 'require(' + quote + replacement + quote + ')';
    });
};


Module.prototype.resolve = function (name) {
  var p         = this.path;
  var resolved  = resolve(p, name) || resolve(p + '/node_modules', name);
  if (!resolved) {
    if (name.indexOf('.js') !== -1) {
      throw new Error('Cannot resolve script ' + name + ' required by ' +
        this.script);
    }
    var s     = name + '.js';
    resolved  = resolve(p, s) || resolve(p + '/node_modules', s);
    if (!resolved) {
      throw new Error('Cannot resolve module ' + name + ' required by ' +
        this.script);
    }
  }
  var relativePath = path.relative(p, resolved);
  return path.join(p, relativePath);
};


exports.create = function (p) {
  if (!p) {
    throw new TypeError('Missing path');
  }
  if (!path.existsSync(p)) {
    throw new Error('File not found: ' + p);
  }
  var config  = {};
  var stat    = fs.statSync(p);
  if (stat.isDirectory()) {
    config.path   = p;
    config.script = p + '/index.js';
    if (!path.existsSync(config.script)) {
      var pkg = readPackageJson(p);
      config.script = path.join(p, pkg.main);
      if(config.script.indexOf('.js') === -1) {
        config.script += ".js";
      }
      if (!path.existsSync(config.script)) {
        throw new Error('Main from package.json in ' + p + ' not found: ' +
          config.script);
      }
      //config.path = path.dirname(config.script);
      config.nomo = pkg.nomo;
    }
  } else {
    config.path   = path.dirname(p);
    config.script = p;
  }
  return new Module(config);
};

exports.Module = Module;
