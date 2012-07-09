/*
 * nomo.js
 *
 * Copyright (c) 2012 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
'use strict';

var path    = require('path');
var fs      = require('fs');
var support = require('./support');

if (!fs.existsSync) {
  fs.existsSync = path.existsSync;
}


function resolveNodeModule(p, name) {
  var resolved = path.resolve(p + '/node_modules', name);
  if (fs.existsSync(resolved)) {
    return resolved;
  }
  var dir = path.dirname(p);
  if (dir.length > 1) {
    return resolveNodeModule(dir, name);
  }
  return null;
}

function resolve(p, name) {
  var resolved = path.resolve(p, name);
  if (fs.existsSync(resolved)) {
    return resolved;
  }
  return resolveNodeModule(path.resolve(p), name);
}


function readPackageJson(p) {
  var packageJson = p + '/package.json';
  if (!fs.existsSync(packageJson)) {
    throw new Error('No index.js nor package.json found in ' + p);
  }
  var json = fs.readFileSync(packageJson).toString();
  return JSON.parse(json);
}


function Module(config) {
  this.path   = config.path;
  this.script = config.script;
  this.nomo   = config.nomo;
  this.pkg    = config.pkg;
  this.name   = config.name;
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
  if (support.has(name)) {
    return name;
  }
  var p = this.path;
  var resolved;
  if (name.indexOf('.js') === -1) {
    resolved = resolve(p, name + '.js');
  }
  if (!resolved) {
    resolved = resolve(p, name);
    if (!resolved) {
      console.log('[warn ] Cannot resolve script "' + name +
        '" required by ' + this.script);
      return null;
    }
  }
  var relativePath = path.relative(p, resolved);
  return path.join(p, relativePath);
};


exports.create = function (p) {
  if (!p) {
    throw new TypeError('Missing path');
  }
  if (support.has(p)) {
    return new Module({
      path    : support.folder,
      script  : support.folder + '/' + p + '.js',
      name    : p
    });
  }
  if (!fs.existsSync(p)) {
    throw new Error('File not found: ' + p);
  }
  var config  = {};
  var stat    = fs.statSync(p);
  if (stat.isDirectory()) {
    config.script = p + '/index.js';
    if (!fs.existsSync(config.script)) {
      var pkg = readPackageJson(p);
      config.script = path.join(p, pkg.main);
      if(config.script.indexOf('.js') === -1) {
        config.script += ".js";
      }
      if (!fs.existsSync(config.script)) {
        throw new Error('Main from package.json in ' + p + ' not found: ' +
          config.script);
      }
      config.nomo = pkg.nomo;
      config.pkg  = pkg;
    }
  } else {
    config.script = p;
  }
  config.path = path.dirname(config.script);
  config.name = config.script.substring(0, config.script.length - 3);
  return new Module(config);
};

exports.Module = Module;
