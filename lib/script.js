function Script(script) {
  this.script = script;
}

Script.prototype.eachRequire = function (fn) {
  this.script = this.script.replace(/require\(("[^"]+"|'[^']+')\)/g,
    function (match, group) {
      var quote = group.substring(0, 1);
      var name = group.substring(1, group.length - 1);
      var replacement = fn(name);
      return 'require(' + quote + replacement + quote + ')';
    });
  return this;
};

Script.prototype.toString = function () {
  return this.script;
};

module.exports = function (script) {
  return new Script(script);
};
