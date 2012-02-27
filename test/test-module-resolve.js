var test      = require('utest');
var assert    = require('assert');

var module    = require('../lib/module');


test('module.resolve', {


  before: function () {
    this.module = module.create('test/fixture');
  },


  'should find module by name in same directory': function () {
    var path = this.module.resolve('a');

    assert.equal(path, 'test/fixture/a.js');
  },


  'should find module for relative path': function () {
    var path = this.module.resolve('./lib/b');

    assert.equal(path, 'test/fixture/lib/b.js');
  },


  'should throw if file does not exit': function () {
    var m = this.module;
    
    assert.throws(function () {
      m.resolve('x/y/z');
    }, 'Error')
  },


  'should find module with .js suffix': function () {
    var m = this.module;

    assert.doesNotThrow(function () {
      m.resolve('a.js');
    });
  },


  'should find module in node_modules': function () {
    var path = this.module.resolve('c/c.js');

    assert.equal(path, 'test/fixture/node_modules/c/c.js');
  }


});
