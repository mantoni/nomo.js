var test    = require('utest');
var assert  = require('assert');

var nomo    = require('../lib/nomo');


test('nomo', {

  'should be function': function () {
    assert.equal(typeof nomo, 'function');
  }

});
