(function () {

  var modules = {{modules}};

  function require(name) {
    var exports = {};
    var module = { exports: exports };
    modules[name](module, exports);
    return module.exports;
  }
  
  window.require = require;

}());
