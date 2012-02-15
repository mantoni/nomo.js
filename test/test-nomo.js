var test    = require('utest');
var assert  = require('assert');

var nomo    = require('../lib/nomo');


test('nomo', {

  'should pass config to generator': function () {
    var config = {};

    var n = nomo(config);

    assert.strictEqual(n.generator.config, config);
  }

});
