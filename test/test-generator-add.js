var test      = require('utest');
var assert    = require('assert');

var generator    = require('../lib/generator');


test('generator.add', {

  before: function () {
    this.g = generator(); 
  },

  'should add formatted and wrapped script to modules': function () {
    this.g.add('foo', 'exports.foo = "bar";')

    assert.equal(this.g.modules.foo, 'function (module, exports) {\n' +
      '  exports.foo = "bar";\n}');
  }

});
