var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

var utils = require('../../utils');

var User = require('../sequelize').models.User;

module.exports = function () {

    // 전략 등록.
    // 메인 루트 패스포트에 각각의 전략을 등록하는 형태임.
    // 로컬 전략은 아이디와 패스워드를 받는 형태임.
    passport.use(new LocalStrategy({
        usernameField: 'aid',
        passwordField: 'secret'
    }, function (aid, secret, done) {
        User.findUserByAid(aid, function(status, data) {
            if (status == 404) {
                return done({
                    status: 404,
                    code: '404_10'
                }, false);
            }
            if (status == 200 ){
                if (!data.authenticate(secret)) {
                    return done({
                        status: 403,
                        code: '403_1'
                    }, false);
                } else {
                    return done(null, data);
                }
            } else {
                return done({
                    status: status
                });
            }
        });
    }));
};