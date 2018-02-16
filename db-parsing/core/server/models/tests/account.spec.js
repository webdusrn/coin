var app = require('../../../../app');
var should = require('should');
var models = require('../../../../bridge/models/sequelize');
var User = models.User;
var META = require('../../metadata/index');
var assert = require('assert');

var userGenderator = require("./flextures/user");

// 전체조건은 유저모델의 테스트이다.
// 즉 유저모델의 관한 테스트만 진행 되어야한다.
describe('[Account Model Test]', function () {

    var userFields;
    var user;

    describe('[Email user test]', function () {

        // 조건
        describe('create invalid email user', function () {

            // 만일 유저데이터의 타입을 누락된 채로 받아왔다면.
            before(function () {
                userFields = userGenderator.getEmailUser();
                delete userFields.type;
            });

            // 그러면
            it('should fail', function (done) {
                User.createUserWithType(userFields, function (status, data) {
                    // 서버단에서 막을수 있었던 코드 이기 때문에 501을 리턴해야한다.
                    status.should.be.exactly(501);
                    user = data;
                    done();
                });
            });

            // 그리고 유저를 찾지 못해야한다.
            after(function (done) {
                done();
            });
        });

        // 조건
        describe('create valid email user', function () {

            // 만일 유저데이터를 정상으로 받아왔다면
            before(function () {
                userFields = userGenderator.getEmailUser();
            });

            // 그러면
            it('should success', function (done) {
                User.createUserWithType(userFields, function (status, data) {
                    status.should.be.exactly(200);
                    data.should.have.property('nick', userFields.nick);
                    user = data;
                    done();
                });
            });

            it('should success to find', function (done) {
                User.findUserById(user.id, function (status, data) {
                    status.should.be.exactly(200);
                    data.should.have.property('nick', user.nick);

                    User.findUserByEmail(user.email, function (status, data) {
                        status.should.be.exactly(200);
                        data.should.have.property('id', user.id);

                        User.findUserByPhoneNumber(user.phoneNum, function (status, data) {
                            status.should.be.exactly(404);
                            done();
                        });
                    });
                });
            });
        });

        describe('check user instance', function () {

            it('should change password', function (done) {
                var newPass = '123123';
                user.changePassword(user.auth, newPass, function (status, data) {
                    user.authenticate(newPass).should.be.exactly(true);
                    done();
                });
            });

            it('should add phone', function (done) {
                var phone = '+821089981764';
                models.Auth.upsertAuth({
                    key: phone,
                    type: META.std.user.signUpTypePhone
                }, function (status, data) {
                    user.addPhoneNumber(data, function (status, data) {
                        status.should.be.exactly(200);

                        User.findUserByPhoneNumber(phone, function (status, data) {
                            data.should.have.property('id').exactly(user.id);

                            user.removePhoneNumber(function (status, data) {
                                status.should.be.exactly(200);
                                done();
                            });
                        });
                    });
                });
            });

            it('should create email token', function (done) {
                var auth = user.createEmailToken();
                auth.should.have.property('type', META.std.user.signUpTypeEmail);
                auth.should.have.property('key', user.email);
                done();
            });

            it('should remove user', function (done) {
                user.delete(function (status, data) {
                    status.should.be.exactly(204);
                    done();
                });
            });

        });
    });
});
