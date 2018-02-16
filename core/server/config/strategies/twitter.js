var passport = require('passport'),
    url = require('url'),
    TwitterStrategy = require('passport-twitter').Strategy,
    config = require('../env/index');

module.exports = function () {
    if (config.twitter && config.twitter.clientID) {
        passport.use(new TwitterStrategy({
            consumerKey: config.twitter.clientID,
            consumerSecret: config.twitter.clientSecret,
            callbackURL: config.twitter.callbackURL,
            passReqToCallback: true
        }, function (req, token, tokenSecret, profile, done) {

            var providerData = profile._json;
            providerData.token = token;
            providerData.tokenSecret = tokenSecret;

            var providerUserProfile = {
                fullName: profile.displayName,
                username: profile.username,
                provider: 'twitter',
                providerId: profile.id,
                providerData: providerData
            };

            done();
        }));
    }
};