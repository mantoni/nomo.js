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

var generator = require('../lib/generator');


test('generator.has', {


  'should return ture if script was added': function () {
    var g = generator.create();
    g.add({
      name        : 'foo',
      eachRequire : function () {}
    });

    assert(g.has('foo'));
  },


  'should return false if script was not added': function () {
    var g = generator.create();

    assert(!g.has('foo'));
  }


});
