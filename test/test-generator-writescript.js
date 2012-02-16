var test      = require('utest');
var assert    = require('assert');
var sinon     = require('sinon');

var generator = require('../lib/generator');
var fs        = require('fs');


test('generator.writeScript', {

  before: function () {
    sinon.stub(fs, 'writeFileSync');
    this.generator = generator();
  },

  after: function () {
    fs.writeFileSync.restore();
  },


  'should write to nomo.js by default': function () {
    this.generator.writeScript();

    sinon.assert.calledOnce(fs.writeFileSync);
    sinon.assert.calledWith(fs.writeFileSync, 'nomo.js');
  },


  'should write to specified filename if provided': function () {
    this.generator.writeScript('/some/file.js');

    sinon.assert.calledWith(fs.writeFileSync, '/some/file.js');
  },


  'should write script': sinon.test(function () {
    this.stub(this.generator, 'toString').returns('some script');

    this.generator.writeScript();

    sinon.assert.calledWith(fs.writeFileSync, 'nomo.js', 'some script');
  })


});
