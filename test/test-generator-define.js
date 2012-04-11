var test      = require('utest');
var assert    = require('assert');
var sinon     = require('sinon');

var generator = require('../lib/generator');
var module    = require('../lib/module');


test('generator.define', {

  before: function () {
    this.generator  = generator.create();
    this.module     = new module.Module({ script : 'foo.js', name: 'foo' });
  },


  'should return script that defined the module': function () {
    this.module.source = 'void 0;';

    this.generator.add(this.module);

    assert.equal(this.generator.define('foo'),
      'require.define(\'foo\', function (module, exports) {\n  void 0;\n});');
  }


});
