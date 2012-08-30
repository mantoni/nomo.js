/*
 * nomo.js
 *
 * Copyright (c) 2012 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
'use strict';

var test      = require('utest');
var assert    = require('assert');
var sinon     = require('sinon');

var generator = require('../lib/generator');
var module    = require('../lib/module');


function assertModule(self, name, script) {
  assert.equal(self.generator.modules[name],
    'function (module, exports, require) {\n  ' + script + '\n}');
}


test('generator.add', {

  before: function () {
    this.generator  = generator.create();
    this.module     = new module.Module({ script : 'foo.js', name : 'foo' });
  },


  'should add module script to generator': function () {
    this.module.source = 'some script';

    this.generator.add(this.module);

    assertModule(this, 'foo', 'some script');
  },


  'should add required script': function () {
    this.module.source = 'require("test/fixture/index");';

    this.generator.add(this.module);

    assertModule(this, 'test/fixture/index', 'console.log(\'index.js\');');
  },


  'should add required module': function () {
    this.module.source = 'require("test/fixture");';

    this.generator.add(this.module);

    assertModule(this, 'test/fixture/index', 'console.log(\'index.js\');');
  },


  'should adjust module name': function () {
    this.module.source = 'require("./test/fixture");';

    this.generator.add(this.module);

    var script = this.generator.toString();
    assert(script.indexOf('require("test/fixture/index");') !== -1);
  },


  'should not process modules twice': sinon.test(function () {
    this.module.source = '';
    this.generator.add(this.module);
    var m = new module.Module({ script : 'foo.js', name: 'foo' });
    this.spy(m, 'eachRequire');
    this.spy(m, 'toString');

    this.generator.add(m);

    sinon.assert.notCalled(m.eachRequire);
    sinon.assert.notCalled(m.toString);
  })


});
