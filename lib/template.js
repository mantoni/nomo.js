(function () {
  /* nomo.js v{{version}} https://github.com/mantoni/nomo.js */
  var instances = {}, modules;

  function require(name) {
    var instance = instances[name];
    if (!instance) {
      var factory = modules[name];
      if (!factory) {
        throw new Error('Unknown module: ' + name);
      }
      var exports = {};
      var module = { exports: exports };
      factory(module, exports);
      instance = instances[name] = module.exports;
    }
    return instance;
  }

  modules = {{modules}};
{{init}}
}());
