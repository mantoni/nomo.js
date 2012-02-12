var test    = require('utest');
var assert  = require('assert');
var sinon   = require('sinon');

var nomo    = require('../lib/nomo');
var module  = require('../lib/module');
var fs      = require('fs');


test('nomo.add', {

  before: function () {
    this.nomo = nomo();
    this.module = module('.');
  },

  'should add module script to generator': sinon.test(function () {
    this.stub(this.module, 'readScript').returns('some script');
    this.stub(this.nomo.generator, 'add');

    this.nomo.add(this.module);

    sinon.assert.calledOnce(this.nomo.generator.add);
    sinon.assert.calledWith(this.nomo.generator.add, '.', 'some script');
  }),

  'should call add with required script': sinon.test(function () {
    this.stub(this.module, 'readScript').returns(
      'require("test/fixture/index");');
    this.stub(this.nomo.generator, 'add');
    
    this.nomo.add(this.module);
    
    sinon.assert.calledTwice(this.nomo.generator.add);
    sinon.assert.calledWith(this.nomo.generator.add, 'test/fixture',
      'console.log(\'index.js\');');
  }),

  'should call add with required module': sinon.test(function () {
    this.stub(this.module, 'readScript').returns('require("test/fixture");');
    this.stub(this.nomo.generator, 'add');
    
    this.nomo.add(this.module);
    
    sinon.assert.calledTwice(this.nomo.generator.add);
    sinon.assert.calledWith(this.nomo.generator.add, 'test/fixture',
      'console.log(\'index.js\');');
  })

});
