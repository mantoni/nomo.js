var test      = require('utest');
var assert    = require('assert');

var module    = require('../lib/module');


test('module.script', {

  'should be path to file': function () {
    var m = module('test/fixture/a.js');

    assert.equal('test/fixture/a.js', m.script);
  },

  'should be path to index.js': function () {
    var m = module('test/fixture');
    
    assert.equal('test/fixture/index.js', m.script);
  },

  'should be path to main file in package.json': function () {
    var m = module('test/fixture/node_modules/c');

    assert.equal('test/fixture/node_modules/c/c.js', m.script);
  },

  'should throw if main file in package.json does not exist': function () {
    assert.throws(function () {
      module('test/fixture/broken');
    }, 'Error');
  }

});
