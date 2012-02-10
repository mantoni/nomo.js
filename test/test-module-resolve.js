var test      = require('utest');
var assert    = require('assert');

var module    = require('../lib/module');


test('module.resolve', {

  'should find module by name in same directory': function () {
    var m = module('test/fixture');
    
    var path = m.resolve('a');
    
    assert.equal(path, 'a.js');
  },

  'should find module for relative path': function () {
    var m = module('test/fixture');
    
    var path = m.resolve('./lib/b');
    
    assert.equal(path, 'lib/b.js');
  },
  
  'should throw if file does not exit': function () {
    var m = module('test/fixture');
    
    assert.throws(function () {
      m.resolve('x/y/z');
    }, 'Error')
  },

  'should find module with .js suffix': function () {
    var m = module('test/fixture');

    assert.doesNotThrow(function () {
      m.resolve('a.js');
    });
  },
  
  'should find module in node_modules': function () {
    var m = module('test/fixture');
    
    var path = m.resolve('c/c.js');
    
    assert.equal(path, 'node_modules/c/c.js');
  }

});
