var app = require('../../../app');
var request = require('supertest');
var should = require('should');

var CONFIG = require('../../../bridge/config/env');
var META = require('../../../bridge/metadata/index');
var STD = META.std;
var commonUtils = require('../utils/common');

describe('Email Accounts Api Tests', function () {

    var usersPost = commonUtils.getAPIParams('/accounts/users', 'post');

    var emailUserParam = JSON.parse(JSON.stringify(usersPost.defaults));
    emailUserParam.type = STD.user.signUpTypeEmail;
    emailUserParam.uid = 'gozillacj@naver.com';
    emailUserParam.nick = '';

    var emailUserParam2 = JSON.parse(JSON.stringify(emailUserParam));
    emailUserParam2.uid = 'gozillacj2@naver.com';
    emailUserParam.nick = '';

    var normalUserParam = JSON.parse(JSON.stringify(usersPost.defaults));
    normalUserParam.type = STD.user.signUpTypeNormalId;
    normalUserParam.uid = 'gozillacj';
    emailUserParam.nick = 'normalId1';

    var phoneUserParam = JSON.parse(JSON.stringify(usersPost.defaults));
    phoneUserParam.type = STD.user.signUpTypePhone;
    phoneUserParam.uid = '+821089981764';
    emailUserParam.nick = 'phone1';

    var phoneIdUserParam = JSON.parse(JSON.stringify(usersPost.defaults));
    phoneIdUserParam.type = STD.user.signUpTypePhoneId;
    phoneIdUserParam.uid = '+821089981764';
    phoneIdUserParam.aid = 'gozillacj';
    phoneIdUserParam.apass = '123qwe';
    emailUserParam.nick = 'phoneId1';

    var socialUserParam = JSON.parse(JSON.stringify(usersPost.defaults));
    socialUserParam.type = STD.user.signUpTypeSocial;
    socialUserParam.provider = STD.user.providerFacebook;
    socialUserParam.uid = '1210123981203';
    socialUserParam.secret = 'aksdfhaksdhfaASdfkuasdhfaDSFDASfaDSFASDfadsf23dsfa23123sdgdf45';
    emailUserParam.nick = 'social1';

    var Account = require('./accounts.spec.suite');
    var emailUser = new Account(emailUserParam);
    var emailUser2 = new Account(emailUserParam2);
    var normalIdUser = new Account(normalUserParam);
    var phoneUser = new Account(phoneUserParam);
    var phoneUserClone = new Account(phoneUserParam);
    var phoneIdUser = new Account(phoneIdUserParam);
    var socialUser = new Account(socialUserParam);

    it('should register email user', function (done) {
        emailUser.signup(done);
    });

    it('should load user', function (done) {
        emailUser.getUserSession(function() {
            var updatedAt1 = emailUser.getData('updatedAt');
            setTimeout(function() {
                emailUser.getUserSession(function() {
                    var updatedAt2 = emailUser.getData('updatedAt');
                    updatedAt2.should.greaterThan(updatedAt1);
                    done();
                });
            }, 100);
        });
    });

    it('should verify email', function (done) {
        emailUser.verifyEmail(STD.user.authEmailSignup, done);
    });

    it('should fail to verify email', function (done) {
        emailUser.verifyEmailFail(STD.user.authEmailSignup, done);
    });

    it('should login email user', function (done) {
        emailUser.loginEmail(done);
    });

    it('should logout user', function (done) {
        emailUser.logout(done);
    });

    it('should login email user', function (done) {
        emailUser.loginEmail(done);
    });

    it('should send find id email auth', function (done) {
        emailUser.sendFindIdEmailAuth(done);
    });

    it('should logout user', function (done) {
        emailUser.logout(done);
    });

    it('should send find pass email auth', function (done) {
        emailUser.setNewPass('1234qwer', done);
    });

    it('should login email user', function (done) {
        emailUser.loginEmail(done);
    });

    it('should remove account', function (done) {
        emailUser.removeAccount(done);
    });

    it('should fail to login email user', function (done) {
        emailUser.loginEmailFail(done);
    });

    it('should register email user2', function (done) {
        emailUser2.signup(done);
    });

    it('should load extinct user', function (done) {
        emailUser2.loadExtinct(emailUser.data.id, function () {
            emailUser2.loadAllExtincts(done);
        });
    });

    it('should remove all extinct users', function (done) {
        emailUser2.removeExtincts(done);
    });

    it('should remove account 2', function (done) {
        emailUser2.removeAccount(done);
    });

    it('should register normal id user', function (done) {
        normalIdUser.signup(done);
    });

    it('should logout user', function (done) {
        normalIdUser.logout(done);
    });

    it('should login normal id user', function (done) {
        normalIdUser.loginNormalId(done);
    });

    it('should remove account', function (done) {
        normalIdUser.removeAccount(done);
    });

    it('should fail to login normal id user', function (done) {
        normalIdUser.loginNormalIdFail(done);
    });

    it('should fail to signup phone user', function (done) {
        phoneUser.signupPhoneAuthFail(done);
    });

    it('should send phone auth number', function (done) {
        phoneUser.sendPhoneAuth(done);
    });

    it('should signup phone user', function (done) {
        phoneUser.signup(done);
    });

    it('should send adding email auth', function (done) {
        phoneUser.sendAddingEmailAuth('gozillacj3@naver.com', done);
    });

    it('should verify adding email', function (done) {
        phoneUser.verifyEmail(STD.user.authEmailAdding, done);
    });

    it('should logout phone user', function (done) {
        phoneUser.logout(done);
    });

    it('should send login auth', function (done) {
        phoneUser.sendLoginPhoneAuth(done);
    });

    it('should login phone', function (done) {
        phoneUser.loginPhone(done);
    });

    it('should remove account', function (done) {
        phoneUser.removeAccount(done);
    });

    it('should send phone auth number', function (done) {
        phoneIdUser.sendPhoneAuth(done);
    });

    it('should signup phoneId user', function (done) {
        phoneIdUser.signup(done);
    });

    it('should find id as phone', function (done) {
        phoneIdUser.findIdAsPhone(done);
    });

    it('should logout phone user', function (done) {
        phoneIdUser.logout(done);
    });

    it('should find pass as phone', function (done) {
        phoneIdUser.findPassAsPhone(done);
    });

    it('should login phone user', function (done) {
        phoneIdUser.loginPhoneId(done);
    });

    it('should remove phone', function (done) {
        phoneIdUser.removePhone(done);
    });

    it('should remove account', function (done) {
        phoneIdUser.removeAccount(done);
    });

    it('should signup social user', function (done) {
        socialUser.signup(done);
    });

    it('should logout social user', function (done) {
        socialUser.logout(done);
    });

    it('should login social user', function (done) {
        socialUser.loginSocial(done);
    });

    it('should remove account', function (done) {
        socialUser.removeAccount(done);
    });

    it('should signup email user', function (done) {
        emailUser.signup(done);
    });

    it('should logout email user', function (done) {
        emailUser.logout(done);
    });

    it('should login email user', function (done) {
        emailUser.loginEmail(done);
    });

    it('should send email auth', function (done) {
        emailUser.authToken = "123";
        emailUser.sendSignupEmailAuth(done);
    });

    it('should verify email', function (done) {
        emailUser.verifyEmail(STD.user.authEmailSignup, done);
    });

    it('should remove account', function (done) {
        emailUser.removeAccount(done);
    });

    it('should signup email user', function (done) {
        emailUser.signup(done);
    });

    it('should send email auth', function (done) {
        emailUser.sendSignupEmailAuth(done);
    });

    it('should verify email', function (done) {
        emailUser.verifyEmail(STD.user.authEmailSignup, done);
    });

    it('should signup social user', function (done) {
        socialUser.signup(done);
    });

    it('should login social user', function (done) {
        socialUser.loginSocial(done);
    });

    it('should fail to send adding email', function (done) {
        socialUser.sendAddingEmailAuthFail(emailUser.getData('email'), done);
    });

    it('should send adding email', function (done) {
        socialUser.sendAddingEmailAuth('gozillacj4@naver.com', done);
    });

    it('should verify email', function (done) {
        socialUser.verifyEmail(STD.user.authEmailAdding, done);
    });

    it('should remove account', function (done) {
        socialUser.removeAccount(done);
    });

    it('should remove account', function (done) {
        emailUser.removeAccount(done);
    });

    it('should signup normal user', function (done) {
        normalIdUser.signup(done);
    });

    it('should send adding auth num as phone', function (done) {
        normalIdUser.sendAddingPhoneAuth('+821089981764', done);
    });

    it('should check adding auth num as phone from normal id user', function (done) {
        normalIdUser.checkAddingPhoneAuth('+821089981764', done);
    });

    it('should check phone number', function (done) {
        normalIdUser.loadUser(function () {
            normalIdUser.getData('phoneNum').should.be.exactly('+821089981764');
            done();
        });
    });

    it('should change password', function (done) {
        normalIdUser.changePassword('123123qwe', done);
    });

    it('should logout', function (done) {
        normalIdUser.logout(done);
    });

    it('should login normal id', function (done) {
        normalIdUser.setFixture('secret', '123123qwe');
        normalIdUser.loginNormalId(done);
    });

    it('should remove account', function (done) {
        normalIdUser.removeAccount(done);
    });


    /**
     * 핸드폰계정 연동테스트
     */

    it('should send phone auth number', function (done) {
        phoneUser.sendPhoneAuth(done);
    });

    it('should signup phone user', function (done) {
        phoneUser.signup(done);
    });

    // 이메일연동
    it('should send adding email auth', function (done) {
        phoneUser.sendAddingEmailAuth('gozillacj3@naver.com', done);
    });

    it('should verify adding email', function (done) {
        phoneUser.verifyEmail(STD.user.authEmailAdding, done);
    });

    it('should fail to remove phone', function (done) {
        phoneUser.removePhoneFail(done);
    });

    // 번호연동 (여기선 번호 변경)
    it('should send adding auth num as phone', function (done) {
        phoneUser.sendAddingPhoneAuth('+821089981763', done);
    });

    it('should check adding auth num as phone', function (done) {
        phoneUser.checkAddingPhoneAuth('+821089981763', done);
    });

    it('should add normal id and pass', function (done) {
        phoneUser.addNormalIdAndPass('abc1', '123qwe', done);
    });

    // 아이디를 변경할 수 있다.
    it('should add normal id and pass', function (done) {
        phoneUser.addNormalIdAndPass('abc12', '123qwe', done);
    });

    it('should remove phone', function (done) {
        phoneUser.removePhone(done);
    });

    it('should logout', function (done) {
        phoneUser.logout(done);
    });

    it('should login', function (done) {
        phoneUser.setFixture('uid', 'abc12');
        phoneUser.setFixture('secret', '123qwe');
        phoneUser.loginNormalId(done);
    });

    // 이메일 아이디를 변경할 수 있다.
    it('should add email id and pass', function (done) {
        phoneUser.addEmailIdAndPass('abc12@naver.com', '123qwe', done);
    });

    it('should logout', function (done) {
        phoneUser.logout(done);
    });

    it('should login', function (done) {
        phoneUser.setFixture('uid', 'abc12@naver.com');
        phoneUser.setFixture('secret', '123qwe');
        phoneUser.loginEmail(done);
    });


    // 다시 일반 아이디로 변경할 수 있다.
    it('should add normal id and pass', function (done) {
        phoneUser.addNormalIdAndPass('abc12', '123qwe', done);
    });

    it('should logout', function (done) {
        phoneUser.logout(done);
    });

    it('should login', function (done) {
        phoneUser.setFixture('uid', 'abc12');
        phoneUser.setFixture('secret', '123qwe');
        phoneUser.loginNormalId(done);
    });

    it('should exists email', function (done) {
        // 아이디로 다시 변경했어도 이메일은 남아 있어야 한다
        phoneUser.data.email.should.exactly('abc12@naver.com');
        done();
    });

    it('should remove email', function (done) {
        phoneUser.removeEmail(done);
    });

    // 소셜연동
    it('should add facebook', function (done) {
        phoneUser.addSocial(STD.user.providerFacebook, '102030405060', 'asldkjfo912lkjsadlfjasldijfla', done);
    });

    it('should fail to add facebook', function (done) {
        phoneUser.addSocialFail(STD.user.providerFacebook, '102030405060', '123123123123123123', done);
    });

    it('should remove facebook', function (done) {
        phoneUser.removeSocial(STD.user.providerFacebook, done);
    });

    it('should fail to add facebook', function (done) {
        phoneUser.addSocial(STD.user.providerFacebook, '102030405060', '123123123123123123', done);
    });

    it('should add kakao', function (done) {
        phoneUser.addSocial(STD.user.providerKakao, '102030405061', 'asld123kjfo912lkjsadlfjasldijfla', done);
    });

    it('should remove account', function (done) {
        phoneUser.removeAccount(done);
    });

    // 외부 로그아웃 테스트
    it('should send phone auth number', function (done) {
        phoneUser.sendPhoneAuth(done);
    });

    it('should register phone user', function (done) {
        phoneUser.signup(done);
    });

    it('should change phone number', function (done) {
        phoneUser.changePhone(done);
    });

    it('should load changed phone user', function (done) {
        phoneUser.loadUser(function() {
            phoneUser.getData('phoneNum').should.exactly('+82108998111111');
            done();
        });
    });

    it('should add email id and pass', function (done) {
        phoneUser.addNormalIdAndPass('abc12', '123qwe', done);
    });

    it('should login email user as other', function (done) {
        phoneUserClone.setFixture('uid','abc12');
        phoneUserClone.setFixture('secret','123qwe');
        phoneUserClone.loginNormalId(done);
    });

    it('should logout for remote', function (done) {
        var phoneUserId = phoneUser.getData('loginHistories')[0].id;
        if (CONFIG.flag.isDuplicatedLogin) {
            phoneUserClone.remoteLogout(phoneUserId, done);
        } else {
            phoneUserClone.remoteLogoutFail(phoneUserId, done);
        }
    });

    it('should fail to remove account', function (done) {
        phoneUser.removeAccountFail(done);
    });

    it('should remove account for clone', function (done) {
        phoneUserClone.removeAccount(done);
    });
});
