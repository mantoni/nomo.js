var test      = require('utest');
var assert    = require('assert');

var module    = require('../lib/module');


test('module', {


  'should throw if path is missing': function () {
    assert.throws(function () {
      module.create();
    }, 'TypeError');
  },


  'should throw if file does not exist': function () {
    assert.throws(function () {
      module.create('some/unknown/path');
    }, 'Error');
  },


  'should throw if directory has no index.js or package.json': function () {
    assert.throws(function () {
      module.create('test/fixture/lib');
    }, 'Error');
  },


  'should set script to file': function () {
    var m = module.create('test/fixture/a.js');

    assert.equal(m.script, 'test/fixture/a.js');
  },


  'should set script to index.js': function () {
    var m = module.create('test/fixture');

    assert.equal(m.script, 'test/fixture/index.js');
  },


  'should set script to main file in package.json': function () {
    var m = module.create('test/fixture/node_modules/c');

    assert.equal(m.script, 'test/fixture/node_modules/c/c.js');
  },


  'should throw if main file in package.json does not exist': function () {
    assert.throws(function () {
      module.create('test/fixture/broken');
    }, 'Error');
  },


  'should use package.json in current directory': function () {
    var m = module.create('.');

    assert.equal(m.script, './index.js');
  },


  'should set nomo to nomo object from package.json': function () {
    var m = module.create('test/fixture/config');
    
    assert.deepEqual(m.nomo, { require: 'foo' });
  },


  'should set name to script name': function () {
    var m = module.create('test/fixture/a.js');

    assert.equal(m.name, 'test/fixture/a');
  },


  'should set name to main file name': function () {
    var m = module.create('test/fixture/node_modules/c');

    assert.equal(m.name, 'test/fixture/node_modules/c/c');
  },


  'should return instance of Module': function () {
    var m = module.create('test/fixture');

    assert(m instanceof module.Module);
  }


});
