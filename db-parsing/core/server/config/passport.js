"use strict";

var passport = require('passport');
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var User = require('./sequelize').models.User;

module.exports = function () {

    // 세션에 아이디 저장.
    passport.serializeUser(function (user, done) {
        if (!user.id) {
            done(true, user);
        } else {
            done(null, user.id);
        }
    });

    // 세션에 있는 아이디로 해당 유저를 불러옴.
    passport.deserializeUser(function (id, done) {
        User.findUserById(id, function(status, data) {
            if (status == 200) {
                done(null, data);
            } else {
                done(null, false, {
                    status: status
                });
            }
        });
    });

    require('./strategies/local.js')();
    require('./strategies/phone.js')();
    require('./strategies/facebook.js')();
    require('./strategies/twitter.js')();
    require('./strategies/google.js')();
};