/*
 * nomo.js
 *
 * Copyright (c) 2012 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
'use strict';

var test      = require('utest');
var assert    = require('assert');
var sinon     = require('sinon');

var module    = require('../lib/module');


function fake(source) {
  return {
    toString    : function () { return source },
    eachRequire : module.Module.prototype.eachRequire
  };
}


test('module.eachRequire', {


  'should invoke each require occurence with script name': sinon.test(
    function () {
      var m   = fake('var x = require("x.js");\nvar y = require("y.js");');
      var spy = sinon.spy();

      m.eachRequire(spy);

      sinon.assert.calledTwice(spy);
      sinon.assert.calledWith(spy, 'x.js');
      sinon.assert.calledWith(spy, 'y.js');
    }
  ),


  'should match single quotes': function () {
    var m   = fake('var x = require(\'x.js\');\nvar y = require(\'y.js\');');
    var spy = sinon.spy();

    m.eachRequire(spy);

    sinon.assert.calledTwice(spy);
    sinon.assert.calledWith(spy, 'x.js');
    sinon.assert.calledWith(spy, 'y.js');
  },


  'should replace module name with return value from callback': function () {
    var m = fake('require("a")');

    m.eachRequire(function () { return 'b'; });

    assert.equal(m.source, 'require("b")');
  }


});
