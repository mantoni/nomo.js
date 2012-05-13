/*
 * nomo.js
 *
 * Copyright (c) 2012 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
'use strict';

var generator = require('./generator');
var mod       = require('./module');


module.exports = function (config) {
  var n       = (config && config.path) || '.';
  var m       = mod.create(n);
  config      = m.nomo || config || { require: m.name };
  config.pkg  = m.pkg || { name: config.name || m.name };
  var g       = generator.create(config);
  g.add(m);
  g.writeScript((config && config.fileName) || null);
};
