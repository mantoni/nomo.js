var generator = require('./generator');
var script    = require('./script');
var mod       = require('./module');
var fs        = require('fs');

function Nomo() {
  this.generator = generator();
}

Nomo.prototype.add = function (m) {
  var self = this;
  var s = m.readScript();
  script(s).eachRequire(function (name) {
    self.add(mod(m.resolve(name)));
  });
  this.generator.add(m.path, s);
};

Nomo.prototype.writeScript = function (fileName) {
  var s = this.generator.toString();
  fs.writeFileSync(fileName || 'nomo.js', s);
};

module.exports = function () {
  return new Nomo();
};
