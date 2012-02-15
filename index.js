/*
 * nomo.js
 *
 * Copyright (c) 2012 Maximilian Antoni <mail@maxantoni.de>
 * MIT Licensed
 */
var nomo    = require('./lib/nomo');
var mod     = require('./lib/module');

var m = mod('.');
var n = nomo(m.nomo || { require: m.name });
n.add(m);
n.writeScript();