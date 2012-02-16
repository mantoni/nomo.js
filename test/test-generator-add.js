var test      = require('utest');
var assert    = require('assert');
var sinon     = require('sinon');

var generator = require('../lib/generator');
var module    = require('../lib/module');
var fs        = require('fs');


function assertModule(self, name, script) {
  assert.equal(self.generator.modules[name],
    'function (module, exports) {\n  ' + script + '\n}');
}


test('generator.add', {

  before: function () {
    this.generator = generator();
    this.module = module('.');
  },


  'should add module script to generator': sinon.test(function () {
    this.stub(this.module, 'toString').returns('some script');

    this.generator.add(this.module);

    assertModule(this, './index', 'some script');
  }),


  'should add required script': sinon.test(function () {
    this.stub(this.module, 'toString').returns(
      'require("test/fixture/index");');

    this.generator.add(this.module);

    assertModule(this, 'test/fixture/index', 'console.log(\'index.js\');');
  }),


  'should add required module': sinon.test(function () {
    this.stub(this.module, 'toString').returns('require("test/fixture");');

    this.generator.add(this.module);

    assertModule(this, 'test/fixture/index', 'console.log(\'index.js\');');
  }),


  'should adjust module name': sinon.test(function () {
    this.stub(this.module, 'toString').returns('require("./test/fixture");');

    this.generator.add(this.module);
    var script = this.generator.toString();

    assert(script.indexOf('require("test/fixture/index");') !== -1);
  })


});
