var test      = require('utest');
var assert    = require('assert');
var sinon     = require('sinon');

var module    = require('../lib/module');
var path      = require('path');


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


  'should warn if file does not exit': sinon.test(function () {
    this.stub(console, 'log');

    this.module.resolve('x/y/z');

    sinon.assert.calledOnce(console.log);
    sinon.assert.calledWith(console.log, sinon.match.re(/^\[warn \]/));
  }),


  'should find module with .js suffix': function () {
    var m = this.module;

    assert.doesNotThrow(function () {
      m.resolve('a.js');
    });
  },


  'should find module in node_modules': function () {
    var path = this.module.resolve('c/c.js');

    assert.equal(path, 'test/fixture/node_modules/c/c.js');
  },


  'should find module in parent node_modules': function () {
    var c = module.create(this.module.resolve('c'));
    
    var path = c.resolve('e');

    assert.equal(path, 'test/fixture/node_modules/e.js');
  },


  'should not resolve support modules': function () {
    assert.equal(this.module.resolve('util'), 'util');
    assert.equal(this.module.resolve('events'), 'events');
    assert.equal(this.module.resolve('assert'), 'assert');
  }


});
