var test    = require('utest');
var assert  = require('assert');
var sinon   = require('sinon');

var nomo    = require('../lib/nomo');
var fs      = require('fs');


test('nomo.writeScript', {

  before: function () {
    sinon.stub(fs, 'writeFileSync');
    this.nomo = nomo();
  },

  after: function () {
    fs.writeFileSync.restore();
  },

  'should write to nomo.js by default': function () {
    this.nomo.writeScript();

    sinon.assert.calledOnce(fs.writeFileSync);
    sinon.assert.calledWith(fs.writeFileSync, 'nomo.js');
  },

  'should write to specified filename if provided': function () {
    this.nomo.writeScript('/some/file.js');

    sinon.assert.calledWith(fs.writeFileSync, '/some/file.js');
  },

  'should write script': sinon.test(function () {
    this.stub(this.nomo.generator, 'toString').returns('some script');

    this.nomo.writeScript();

    sinon.assert.calledWith(fs.writeFileSync, 'nomo.js', 'some script');
  })

});
