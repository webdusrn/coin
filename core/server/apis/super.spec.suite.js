var app = require('../../../app');
var should = require('should');
var tester = require('../utils/response-tester');

var META = require('../../../bridge/metadata/index');
var STD = META.std;

function SuperModel(fixture) {
    this.cookie = '';
    this.data = {};
    this.fixture = fixture;
}

SuperModel.prototype.setData = function(key, value) {
    this.data[key] = value;
};

SuperModel.prototype.getData = function (key) {
    return this.data[key];
};

SuperModel.prototype.setFixture = function(key, value) {
    this.fixture[key] = value;
};

SuperModel.prototype.getFixture = function (key) {
    return this.fixture[key];
};

SuperModel.prototype.setCookie = function (cookie) {
    this.cookie = cookie;
};

SuperModel.prototype.getCookie = function () {
    return this.cookie;
};

module.exports = SuperModel;