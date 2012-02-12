/*
 * nomo.js
 *
 * Copyright (c) 2012 Maximilian Antoni <mail@maxantoni.de>
 * MIT Licensed
 */
var nomo    = require('./lib/nomo');
var mod     = require('./lib/module');

var n = nomo();
n.add(mod('.'));
n.writeScript();