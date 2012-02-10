var test      = require('utest');
var assert    = require('assert');

var module    = require('../lib/module');


test('module', {

  'should throw if path is missing': function () {
    assert.throws(function () {
      module();
    }, 'TypeError');
  },
  
  'should throw if file does not exist': function () {
    assert.throws(function () {
      module('some/unknown/path');
    }, 'Error');
  },
  
  'should throw if directory has no index.js or package.json': function () {
    assert.throws(function () {
      module('test/fixture/lib');
    }, 'Error');
  }

});
