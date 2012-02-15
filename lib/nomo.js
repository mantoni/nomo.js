/*
 * nomo.js
 *
 * Copyright (c) 2012 Maximilian Antoni <mail@maxantoni.de>
 * MIT Licensed
 */
var generator = require('./generator');
var script    = require('./script');
var mod       = require('./module');
var fs        = require('fs');

function Nomo(config) {
  this.generator = generator(config);
}

Nomo.prototype.add = function (m) {
  var self = this;
  var s = m.readScript();
  this.generator.add(m.name, s);
  script(s).eachRequire(function (name) {
    self.add(mod(m.resolve(name)));
  });
};

Nomo.prototype.writeScript = function (fileName) {
  var s = this.generator.toString();
  fs.writeFileSync(fileName || 'nomo.js', s);
};

module.exports = function (config) {
  return new Nomo(config);
};
