#!/usr/bin/env node
if (process.argv.length > 2) {
  if (process.argv[2] === 'server') {
    require('../lib/server').start();
    return;
  }
}
var nomo = require('../lib/nomo');
nomo();
