/*
 * nomo.js
 *
 * Copyright (c) 2012 Maximilian Antoni <mail@maxantoni.de>
 * MIT Licensed
 */
var generator = require('./generator');
var mod       = require('./module');


module.exports = function (config) {
  var n = (config && config.path) || '.';
  var m = mod.create(n);
  var g = generator(config || { require: m.name });
  g.add(m);
  g.writeScript();
};
