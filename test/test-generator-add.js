var test      = require('utest');
var assert    = require('assert');

var generator = require('../lib/generator');
var module    = require('../lib/module');


function assertModule(self, name, script) {
  assert.equal(self.generator.modules[name],
    'function (module, exports) {\n  ' + script + '\n}');
}


test('generator.add', {

  before: function () {
    this.generator  = generator();
    this.module     = new module.Module({ script : 'foo.js' });
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
  }


});
