var passport = require('passport'),
    CustomStrategy = require('passport-custom').Strategy;

var utils = require('../../utils');

var User = require('../sequelize').models.User;

module.exports = function () {

    passport.use('phone', new CustomStrategy({
            usernameField: 'phoneNum',
            passwordField: 'secret'
        }, function (done) {
            User.findUserByPhoneNumber(phoneNum, function (status, data) {
                if (status == 404) {
                    return done({
                        status: 404,
                        code: '404_10'
                    }, false);
                }
                if (status == 200) {
                    return done(null, data);
                } else {
                    return done({
                        status: status
                    });
                }
            });
        }
    ));
};