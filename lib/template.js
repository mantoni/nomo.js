/*
 * {{title}}
 *
 * @generator nomo.js v{{version}}
 */
(function (modules) {
  'use strict';
  var instances = {};
  var delegate = window.require;

  function require(name) {
    if (!instances.hasOwnProperty(name)) {
      var factory = modules[name];
      if (!factory) {
        if (delegate) {
          return instances[name] = { exports: delegate(name) };
        }
        throw new Error('Unknown module: ' + name);
      }
      var exports = {};
      instances[name] = { exports: exports };
      factory(instances[name], exports, require);
    }
    return instances[name].exports;
  }

  require.define = function (name, factory) {
    if (modules[name]) {
      throw new Error('Module "' + name + '" already defined.');
    }
    modules[name] = factory;
  };

{{init}}
}({{modules}}));
