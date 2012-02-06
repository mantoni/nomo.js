var test      = require('utest');
var assert    = require('assert');

var script    = require('../lib/script');


test('script.indent', {

  'should return itself': function () {
    var s1 = script('');

    var s2 = s1.indent();

    assert.strictEqual(s1, s2);
  },

  'should indent given script by 2 spaces': function () {
    var s = script('"foo";\n"bar";');

    s = s.indent();

    assert.equal(s.toString(), '  "foo";\n  "bar";');
  }

});
