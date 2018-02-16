var passport = require('passport'),
    url = require('url'),
    FacebookStrategy = require('passport-facebook').Strategy,
    config = require('../env/index');

const META = require('../../../../bridge/metadata');
var USER = META.std.user;
var User = require('../sequelize').models.User;

module.exports = function () {

    if (config.facebook && config.facebook.clientID) {
        passport.use(new FacebookStrategy({
            clientID: config.facebook.clientID,
            clientSecret: config.facebook.clientSecret,
            callbackURL: config.facebook.callbackURL,
            passReqToCallback: true
        }, function (req, accessToken, refreshToken, profile, done) {

            var providerData = profile._json;
            providerData.accessToken = accessToken;

            var nick = profile.displayName;
            if (!nick) {
                nick = (profile.name.givenName || "") + (profile.name.middleName || "") + (profile.name.familyName || "");
                if (!nick) {
                    nick = profile.username || null;
                }
            }

            var providerUserProfile = {
                type: USER.signUpTypeSocial,
                uid: profile.id,
                provider: USER.providerFacebook,
                secret: accessToken,
                nick: nick,
                gender: null,
                birth: null,
                ip: req.refinedIP,
                deviceToken: null,
                deviceType: null,
                country: req.country,
                language: req.language
            };

            var loginHistory = req.models.LoginHistory.parseLoginHistory(req, req.body);

            User.checkAccountForProvider(req, null, providerUserProfile, loginHistory, function (status, data) {
                if (status == 200) {
                    done(null, data);
                } else if (status == 301) {
                    data.isMore = true;
                    done(null, data);
                } else {
                    done(data);
                }
            });
        }));
    }
};