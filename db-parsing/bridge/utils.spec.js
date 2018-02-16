var should = require('should');
var assert = require('assert');

var utils = require('./utils');

describe('[Bridge Utils Test]', function () {
    it ('should mix dir', function (done) {

        var coreCodePath = '../core/server/metadata/codes';
        var appCodePath = '../app/server/metadata/codes';

        var codes = utils.mixFromDir(__dirname, coreCodePath, appCodePath);

        codes.should.have.property('ko');
        //codes.should.have.property('en');
        codes.should.not.have.property('kr');

        done();
    });
});
