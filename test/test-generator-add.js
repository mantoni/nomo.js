var test      = require('utest');
var assert    = require('assert');

var generator    = require('../lib/generator');


test('generator.add', {

  'should add formatted and wrapped script to modules': function () {
    var g = generator();

    g.add('foo', 'exports.foo = "bar";')

    assert.equal(g.modules.foo, 'function (module, exports) {\n' +
      '    exports.foo = "bar";\n  }');
  }

});
