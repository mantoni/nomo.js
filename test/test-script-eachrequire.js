var test      = require('utest');
var assert    = require('assert');
var sinon     = require('sinon');

var script    = require('../lib/script');


test('script.eachRequire', {


  'should invoke each require occurence with script name': function () {
    var spy = sinon.spy();
    var s = script('var x = require("x.js");\nvar y = require("y.js");');

    s.eachRequire(spy);

    sinon.assert.calledTwice(spy);
    sinon.assert.calledWith(spy, 'x.js');
    sinon.assert.calledWith(spy, 'y.js');
  },


  'should match single quotes': function () {
    var spy = sinon.spy();
    var s = script('var x = require(\'x.js\');\n' +
      'var y = require(\'y.js\');');

    s.eachRequire(spy);

    sinon.assert.calledTwice(spy);
    sinon.assert.calledWith(spy, 'x.js');
    sinon.assert.calledWith(spy, 'y.js');
  },


  'should replace module name with return value from callback': function () {
    var s = script('require("a")');
    
    s.eachRequire(function () { return 'b'; });
    
    assert.equal(s.toString(), 'require("b")');
  }


});
