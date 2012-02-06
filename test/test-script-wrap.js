var test      = require('utest');
var assert    = require('assert');

var script    = require('../lib/script');


test('script.wrap', {

  'should return itself': function () {
    var s1 = script('');

    var s2 = s1.wrap();

    assert.strictEqual(s1, s2);
  },

  'should wrap given scipt in module function': function () {
    var s = script('console.log("hello world");');

    s = s.wrap();

    assert.equal(s.toString(), 'function (module, exports) {\n' +
      'console.log("hello world");\n}');
  }

});
