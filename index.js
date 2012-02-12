var nomo    = require('./lib/nomo');
var mod     = require('./lib/module');

var n = nomo();
n.add(mod('.'));
n.writeScript();