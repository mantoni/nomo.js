var test      = require('utest');
var assert    = require('assert');
var sinon     = require('sinon');

var generator = require('../lib/generator');
var fs        = require('fs');


test('generator.writeScript', {

  before: function () {
    this.generator = generator.create();
  },


  'should write script to stdout by default': sinon.test(function () {
    this.stub(this.generator, 'toString').returns('some script');
    this.stub(process.stdout, 'write');

    this.generator.writeScript();

    sinon.assert.calledOnce(process.stdout.write);
    sinon.assert.calledWith(process.stdout.write, 'some script');
  }),


  'should write script to specified filename if provided': sinon.test(
    function () {
      this.stub(fs, 'writeFileSync');
      this.stub(this.generator, 'toString').returns('some script');

      this.generator.writeScript('/some/file.js');

      sinon.assert.calledOnce(fs.writeFileSync);
      sinon.assert.calledWith(fs.writeFileSync, '/some/file.js',
        'some script');
    }
  )


});
