#!/usr/bin/env node
/**
 * nomo.js
 *
 * Copyright (c) 2012 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
if (process.argv.length > 2) {
  if (process.argv[2] === 'server') {
    require('../lib/server').start();
    return;
  }
}
var nomo = require('../lib/nomo');
nomo();
