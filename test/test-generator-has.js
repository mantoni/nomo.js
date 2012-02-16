var test      = require('utest');
var assert    = require('assert');

var generator = require('../lib/generator');


test('generator.has', {


  'should return ture if script was added': function () {
    var g = generator();
    g.add({ name: 'foo' });
    
    assert(g.has('foo'));
  },


  'should return false if script was not added': function () {
    var g = generator();
    
    assert(!g.has('foo'));
  }


});
