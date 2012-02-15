var test      = require('utest');
var assert    = require('assert');

var generator = require('../lib/generator');
var vm        = require('vm');


function requireExportingGenerator() {
  return generator({ exportRequire: true });
}

function compile(g) {
  var sandbox = { window: {} };
  vm.runInNewContext(g.toString(), sandbox);
  return sandbox.window;
}

function compileOne(code) {
  var g = requireExportingGenerator().add('test', code);
  var w = compile(g);
  return w.require('test');
}

function compileTwo(one, two) {
  var g = requireExportingGenerator().add('one', one).add('two', two);
  var w = compile(g);
  return {
    one: w.require('one'),
    two: w.require('two')
  };
}


test('generator', {

  'should not export require function by default': function () {
    var g = generator();
    
    var w = compile(g);
    
    assert.equal(typeof w.require, 'undefined');
  },

  'should export module properties': function () {
    var m = compileOne('exports.yesno = true; exports.fn = function () {};');

    assert.strictEqual(m.yesno, true);
    assert.equal(typeof m.fn, 'function');
  },

  'should export module function': function () {
    var m = compileOne('module.exports = function () {};');

    assert.equal(typeof m, 'function');
  },

  'should include two modules': function () {
    var modules = compileTwo('exports.a=1;', 'exports.b=2;');

    assert.strictEqual(modules.one.a, 1);
    assert.strictEqual(modules.two.b, 2);
  },

  'should resolve require in modules': function () {
    var modules = compileTwo('exports.a = require("two");', 'exports.b=3;');

    assert.strictEqual(modules.one.a.b, 3);
  },

  'should cache exported object': function () {
    var g = requireExportingGenerator().add('test', '');
    var w = compile(g);

    var e1 = w.require('test');
    var e2 = w.require('test');

    assert.strictEqual(e1, e2);
  },

  'should throw meaningful error if module is not defined': function () {
    var g = requireExportingGenerator();
    var w = compile(g);

    assert.throws(function () {
      w.require('some/module');
    }, /^Error\: Unknown module\: some\/module$/);
  },

  'should require configured module': function () {
    var g = generator({ require: 'test' });
    g.add('test', 'window.x="x";');

    var sandbox = { window: {} };
    vm.runInNewContext(g.toString(), sandbox);

    assert.equal(sandbox.window.x, "x");
  },

  'should assign export object to configured target': function () {
    var g = generator({ require: 'test', exportTarget: 'some.path' });
    g.add('test', 'exports.x="x";');

    var sandbox = { some: {} };
    vm.runInNewContext(g.toString(), sandbox);

    assert.equal(sandbox.some.path.x, "x");
  },

  'should assign require function to configured target': function () {
    var g = generator({ requireTarget: 'ns.req' });
    g.add('test', 'exports.x="x";');

    var sandbox = { ns: {} };
    vm.runInNewContext(g.toString(), sandbox);

    assert.equal(sandbox.ns.req('test').x, "x");
  },

  'should allow to combine requireTarget and exportTarget': function () {
    var g = generator({
      require: 'test',
      exportTarget: 'some.module',
      requireTarget: 'some.require'
    });
    g.add('test', 'exports.x="x";');

    var sandbox = { some: {} };
    vm.runInNewContext(g.toString(), sandbox);

    assert.equal(sandbox.some.module.x, "x");
    assert.strictEqual(sandbox.some.require('test'), sandbox.some.module);
  }

});
