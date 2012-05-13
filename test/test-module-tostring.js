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

var module    = require('../lib/module');
var fs        = require('fs');


test('module.toString', {


  'should read module script file and return as string': function () {
    var expectation = fs.readFileSync('test/fixture/index.js').toString();
    var m           = module.create('test/fixture');

    var script      = m.toString();

    assert.equal(script, expectation)
  }


});
