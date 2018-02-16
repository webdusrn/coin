var app = require('../../../app');
var request = require('supertest');
var should = require('should');
var tester = require('../utils/response-tester');
var util = require('util');

var META = require('../../../bridge/metadata/index');
var STD = META.std;
var resform = require('../resforms');
var Super = require('./super.spec.suite');
var querystring = require('querystring');

var url = {
    users: "/api/accounts/users",
    session: "/api/accounts/session",
    extinctUsers: "/api/accounts/extinct-users",
    senderPhone: "/api/accounts/sender-phone",
    authEmail: "/api/accounts/auth-email",
    socialSession: "/api/accounts/social-session",
    senderEmail: "/api/accounts/sender-email",
    authPhone: "/api/accounts/auth-phone",
    authIdPass: "/api/accounts/auth-id-pass",
    authSocial: "/api/accounts/auth-social",
    pass: "/api/accounts/pass",
    sessionRemote: "/api/accounts/session-remote",
    role: "/api/accounts/role"
};

function Notification(fixture) {
    Notification.super_.call(this, fixture);
}

util.inherits(Notification, Super);

Account.prototype.getUserSession = function (callback) {
    var self = this;
    request(app).put(url.session)
        .set("Cookie", self.cookie)
        .end(function (err, res) {
            res.status.should.exactly(200);
            self.data = res.body;
            callback();
        });
};

Account.prototype.loadUser = function (callback) {
    var self = this;
    request(app).get(url.users + "/" + self.getData('id'))
        .end(function (err, res) {
            res.status.should.exactly(200);
            self.data = res.body;
            callback();
        });
};

Account.prototype.sendPhoneAuth = function (callback) {
    var self = this;
    request(app).post(url.senderPhone)
        .send({
            phoneNum: self.getFixture('uid'),
            type: STD.user.authPhoneSignup
        })
        .end(function (err, res) {
            res.status.should.exactly(200);
            res.body.should.be.an.String;
            if (res.header['set-cookie']) {
                self.cookie = res.header['set-cookie'][0];
            }
            self.setFixture('secret', res.body);
            callback();
        });
};

module.exports = Account;