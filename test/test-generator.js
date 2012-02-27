var test      = require('utest');
var assert    = require('assert');

var generator = require('../lib/generator');
var module    = require('../lib/module');
var vm        = require('vm');


function compile(g) {
  var sandbox = { window : {} };
  vm.runInNewContext(g.toString(), sandbox);
  return sandbox.window;
}

function fakeModule(name, source) {
  var m = new module.Module({
    script : name + '.js'
  });
  m.source = source;
  return m;
}

function compileOne(code) {
  var g = generator({
    exportRequire : true
  });
  g.add(fakeModule('test', code));
  var w = compile(g);
  return w.require('test');
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
    var g = generator({
      exportRequire : true
    });
    g.add(fakeModule('one', 'exports.a=1;'));
    g.add(fakeModule('two', 'exports.b=2;'));
    var w = compile(g);
    var one = w.require('one');
    var two = w.require('two');

    assert.strictEqual(one.a, 1);
    assert.strictEqual(two.b, 2);
  },


  'should cache exported object': function () {
    var g = generator({
      exportRequire : true
    });
    var m = fakeModule('test', '');
    g.add(m);
    var w = compile(g);

    var e1 = w.require('test');
    var e2 = w.require('test');

    assert.strictEqual(e1, e2);
  },


  'should throw meaningful error if module is not defined': function () {
    var g = generator({
      exportRequire : true
    });
    var w = compile(g);

    assert.throws(function () {
      w.require('some/module');
    }, /^Error\: Unknown module\: some\/module$/);
  },


  'should require configured module': function () {
    var g = generator({
      require : 'test'
    });
    g.add(fakeModule('test', 'window.x="x";'));

    var sandbox = { window : {} };
    vm.runInNewContext(g.toString(), sandbox);

    assert.equal(sandbox.window.x, "x");
  },


  'should assign export object to configured target': function () {
    var g = generator({
      require       : 'test',
      exportTarget  : 'some.path'
    });
    g.add(fakeModule('test', 'exports.x="x";'));

    var sandbox = { some : {} };
    vm.runInNewContext(g.toString(), sandbox);

    assert.equal(sandbox.some.path.x, "x");
  },


  'should assign require function to configured target': function () {
    var g = generator({
      requireTarget : 'ns.req'
    });
    g.add(fakeModule('test', 'exports.x="x";'));

    var sandbox = { ns : {} };
    vm.runInNewContext(g.toString(), sandbox);

    assert.equal(sandbox.ns.req('test').x, "x");
  },


  'should allow to combine requireTarget and exportTarget': function () {
    var g = generator({
      require       : 'test',
      exportTarget  : 'some.module',
      requireTarget : 'some.require'
    });
    g.add(fakeModule('test', 'exports.x="x";'));

    var sandbox = { some : {} };
    vm.runInNewContext(g.toString(), sandbox);

    assert.equal(sandbox.some.module.x, "x");
    assert.strictEqual(sandbox.some.require('test'), sandbox.some.module);
  }


});
