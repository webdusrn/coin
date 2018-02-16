var get = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

get.validate = function () {
    return function (req, res, next) {
        var USER = req.meta.std.user;
        req.check('token', '400_17').len(1, 2000);
        req.query.token = decodeURIComponent(req.query.token);

        req.check('type', '400_3').isEnum([USER.authEmailSignup, USER.authEmailAdding, USER.authEmailFindPass]);

        if (req.query.successRedirect !== undefined) {
            req.query.successRedirect = decodeURIComponent(req.query.successRedirect);
            req.check('successRedirect', '400_3').len(1, 500);
        }
        if (req.query.errorRedirect !== undefined) {
            req.query.errorRedirect = decodeURIComponent(req.query.errorRedirect);
            req.check('errorRedirect', '400_3').len(1, 500);
        }
        if (req.query.email !== undefined) {
            req.query.email = decodeURIComponent(req.query.email);
            req.check('email', '400_1').isEmail();
        }

        if (req.query.type == USER.authEmailFindPass && req.query.email === undefined) {
            return res.hjson(req, next, 400, {
                code: '400_14'
            });
        }
        req.utils.common.checkError(req, res, next);
    };
};

get.consent = function () {
    return function (req, res, next) {

        var USER = req.meta.std.user;
        var type = req.query.type;

        // 가입, 연동은 로그인이 되어 있어야만 한다
        if (!req.isAuthenticated() && (
            type == USER.authEmailSignup || type == USER.authEmailAdding)) {
            if (!req.query.errorRedirect || process.env.NODE_ENV == 'test') {
                return res.hjson(req, next, 401);
            } else {
                res.status(401);
                return res.redirect(req.query.errorRedirect);
            }
        }

        // 비번찾기가 아니라면 이메일 가입 및 연동을 완료한다
        if (type != USER.authEmailFindPass) {
            req.user.verifyAuth(req.query.token, req.query.type, function (status, body) {
                if (status == 200) {
                    req.user = body;
                    return next();
                }

                var verifyStatus = status;
                var verifyBody = body;

                res.status(status);
                req.coreUtils.session.logout(req, function (status, data) {
                    if (status == 204) {
                        var text = '';
                        var err = {};

                        if (status == 404) {
                            // 해당 토큰이 존재하지 않음.
                            err = {code: '404_5'};
                        } else if (status == 400) {
                            // 이미 인증되었음.
                            err = {code: '400_33'};
                        } else if (status == 403) {
                            // 만기되었거나 잘못된 인증정보.
                            err = {code: '403_4'};
                        } else {
                            err = body;
                        }

                        if (process.env.NODE_ENV == 'test') {
                            return res.hjson(req, next, verifyStatus, verifyBody);
                        }
                        text = req.coreUtils.common.errorTranslator(err);
                        console.log(text);

                        if (!req.query.errorRedirect || process.env.NODE_ENV == 'test') {
                            return res.hjson(req, next, 401);
                        } else {
                            res.status(401);
                            return res.redirect(req.query.errorRedirect);
                        }
                    }
                    else {
                        res.hjson(req, next, status, data);
                    }
                });
            });
        } else {
            next();
        }
    };
};

get.supplement = function () {
    return function (req, res, next) {
        var USER = req.meta.std.user;
        var type = req.query.type;

        // 비번 찾기가 아니라면
        if (type != USER.authEmailFindPass) {
            if (!req.query.successRedirect || process.env.NODE_ENV == 'test') {
                return res.hjson(req, next, 200, req.user);
            }
            res.status(200);
            res.redirect(req.query.successRedirect);
        }
        else {
            if (!req.query.successRedirect || process.env.NODE_ENV == 'test') {
                return res.hjson(req, next, 200, {
                    email: req.query.email,
                    token: req.query.token
                });
            } else {
                res.status(200);
                res.redirect(req.query.successRedirect + "?email=" + req.query.email + "&token=" + req.query.token);
            }
        }
    };
};

module.exports = get;
