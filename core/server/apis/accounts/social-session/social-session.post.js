var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var passport = require('passport');
var UAParser = require('ua-parser-js');

post.validate = function () {
    return function (req, res, next) {
        const USER = req.meta.std.user;
        req.check('provider', '400_3').isEnum(USER.enumProviders);
        req.check('pid', '400_8').len(1, 200);
        req.check('accessToken', '400_8').len(1, 1000);

        if (req.body.platform !== undefined) {
            req.check('platform', '400_8').len(1, 1000);
        }

        if (req.body.device !== undefined) {
            req.check('device', '400_8').len(1, 1000);
        }

        if (req.body.browser !== undefined) {
            req.check('browser', '400_8').len(1, 1000);
        }

        if (req.body.version !== undefined) {
            req.check('version', '400_8').len(1, 1000);
        }

        if (req.body.token !== undefined) {
            req.check('token', '400_8').len(1, 1000);
        }

        req.utils.common.checkError(req, res, next);
    };
};

post.getUser = function () {
    return function (req, res, next) {
        req.models.Provider.checkAndRefreshToken(req.body.provider, req.body.pid, req.body.accessToken, function (status, data) {
            if (status == 200) {
                next();
            } else {
                res.hjson(req, next, 403);
            }
        });
    };
};

post.removeAllSessions = function () {
    return function (req, res, next) {
        var USER = req.meta.std.user;

        req.loadedUser = null;
        req.providerUserProfile = {
            type: USER.signUpTypeSocial,
            uid: req.body.pid,
            provider: req.body.provider,
            secret: req.body.accessToken
        };

        req.models.Provider.findDataIncluding({
                'type': req.providerUserProfile.provider,
                'uid': req.providerUserProfile.uid
            }, [{
                model: req.models.User,
                as: 'user',
                include: req.models.User.getIncludeUser()
            }],
            function (status, data) {
                if (status == 200) {
                    req.loadedUser = data.user;
                    if (req.config.flag.isDuplicatedLogin) {
                        next();
                    } else {
                        req.coreUtils.session.removeAllLoginHistoriesAndSessions(req, data.user.id, function (status, data) {
                            if (status == 204 || status == 404) {
                                next();
                            }
                            else {
                                res.hjson(req, next, status, data);
                            }
                        });
                    }
                }
                else {
                    next();
                }
            }
        );
    };
};

post.logInUser = function () {
    return function (req, res, next) {

        var loginHistory = req.models.LoginHistory.parseLoginHistory(req, req.body);

        req.models.User.checkAccountForProvider(req, req.loadedUser, req.providerUserProfile, loginHistory, function (status, data) {
            if (status == 200) {
                next();
            } else if (status == 301) {
                res.hjson(req, next, 301);
            } else {
                res.hjson(req, next, 403);
            }
        });
    };
};

post.checkLoginHistoryCountAndRemove = function () {
    return function (req, res, next) {

        req.models.LoginHistory.checkLoginHistoryCountAndRemove(req.user.id, function (status, data) {
            if (status == 200) {

                data.forEach(function (loginHistory) {
                    var sessionId = loginHistory.session;

                    req.sessionStore.destroy(sessionId, function (err) {
                        if (err) {
                            logger.e(err);
                        }
                    });
                });

            } else {
                logger.e(data);
            }
        });
        next();
    };
};

post.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.user.toSecuredJSON());
    };
};

module.exports = post;