var test      = require('utest');
var assert    = require('assert');

var generator = require('../lib/generator');
var vm        = require('vm');


function compile(g) {
  var sandbox = { window: {} };
  vm.runInNewContext(g.toString(), sandbox);
  return sandbox.window.require;
}

function compileOne(code) {
  var g = generator().add('test', code);
  var requireFn = compile(g);
  return requireFn('test');
}

function compileTwo(one, two) {
  var g = generator().add('one', one).add('two', two);
  var requireFn = compile(g);
  return {
    one: requireFn('one'),
    two: requireFn('two')
  };
}


test('generator', {

  'should export properties': function () {
    var m = compileOne('exports.yesno = true; exports.fn = function () {};');

    assert.strictEqual(m.yesno, true);
    assert.equal(typeof m.fn, 'function');
  },

  'should export function': function () {
    var m = compileOne('module.exports = function () {};');

    assert.equal(typeof m, 'function');
  },

  'should include two modules': function () {
    var modules = compileTwo('exports.a=1;', 'exports.b=2;');

    assert.strictEqual(modules.one.a, 1);
    assert.strictEqual(modules.two.b, 2);
  },

  'should cache export object': function () {
    var g = generator().add('test', '');
    var requireFn = compile(g);

    var e1 = requireFn('test');
    var e2 = requireFn('test');

    assert.strictEqual(e1, e2);
  },

  'should throw meaningful error if module is not defined': function () {
    var g = generator();
    var requireFn = compile(g);

    assert.throws(function () {
      requireFn('some/module');
    }, /^Error\: Unknown module\: some\/module$/);
  }

});
