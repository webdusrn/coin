var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

post.validate = function () {
    return function (req, res, next) {
        var USER = req.meta.std.user;
        var type = req.body.type;

        req.check('type', '400_3').isEnum(USER.enumAuthEmailTypes);
        req.check('email', '400_1').isEmail();

        if (req.body.successRedirect !== undefined) req.check('successRedirect', '400_3').len(1, 500);
        if (req.body.errorRedirect !== undefined) req.check('errorRedirect', '400_3').len(1, 500);

        req.utils.common.checkError(req, res, next);
    };
};

post.additionalValidate = function () {
    return function (req, res, next) {
        var USER = req.meta.std.user;
        var type = req.body.type;

        // 이메일 연동 / 가입 인증을 할때는 반드시 로그인을 한 상태여야 한다.
        if (!req.isAuthenticated() &&
            (type == USER.authEmailAdding || type == USER.authEmailSignup)) {
            return res.hjson(req, next, 401);
        }

        // 이메일 연동은 자동으로 승인되는 형식일때는 지원하지 않는다.
        if (type == USER.authEmailAdding && req.config.flag.isAutoVerifiedEmail == true) {
            return res.hjson(req, next, 400, {
                code: '400_38'
            });
        }

        // 가입인증인 경우 이메일 인증이 아직 되어 있지 않아야 한다.
        // 이메일 연동의 경우에도 현재 이메일이 없어야 한다.
        if ((req.body.type == USER.authEmailSignup && req.user.isVerifiedEmail) ||
            (req.body.type == USER.authEmailAdding && req.user.email)) {
            res.hjson(req, next, 400, {code: '400_33'});
        } else {
            next();
        }
    };
};

post.loadEmailUser = function () {
    return function (req, res, next) {
        // 이메일 추가 연동에만 email 유저를 로드할 수 없다.
        if (req.body.type !== req.meta.std.user.authEmailAdding) {
            req.models.User.findUserByEmail(req.body.email, function (status, data) {
                if (status == 200) {
                    req.loadedUser = data;
                    // 아이디 찾기에 aid가 설정되어 있지 않으면 오류
                    if (req.body.type !== req.meta.std.user.authEmailFindId && !data.aid) {
                        res.hjson(req, next, 400, {
                            code: '400_58'
                        });
                    } else {
                        next();
                    }
                } else {
                    res.hjson(req, next, status, data);
                }
            });
        } else {
            next();
        }
    };
};

post.upsertAuth = function () {
    return function (req, res, next) {
        var USER = req.meta.std.user;

        // adding의 경우 이미 로그인이 되어 있다.
        if (req.body.type == USER.authEmailAdding) {
            req.user.updateEmailAndAuth(req.body.email, function (status, data) {
                if (status == 200) {
                    req.auth = data.auth;
                    next();
                } else {
                    res.hjson(req, next, status, data);
                }
            });
        }
        // 아이디 찾기의 경우 auth인증을 하지 않는다.
        else if (req.body.type == USER.authEmailFindId) {
            next();
        }
        // 그외 (비번찾기, 가입인증) 경우 이메일로 가입된 계정이 이미 있어야한다.
        else {
            req.models.Auth.upsertAuth({
                key: req.body.email,
                type: req.body.type
            }, function (status, data) {
                if (status == 200) {
                    req.auth = data;
                    next();
                } else if (status == 404) {
                    res.hjson(req, next, 404, {code: '404_10'});
                } else {
                    res.hjson(req, next, status, data);
                }
            });
        }
    };
};

post.sendEmailAuth = function () {
    return function (req, res, next) {
        var USER = req.meta.std.user;
        if (req.body.type == USER.authEmailAdding) {
            req.coreUtils.notification.email.adding(req, {
                successRedirect: req.body.successRedirect,
                errorRedirect: req.body.errorRedirect
            },req.auth, function (status, data) {
                if (status == 204) {
                    next();
                } else {
                    res.hjson(req, next, 503);
                }
            });
        } else if (req.body.type == USER.authEmailFindId) {
            req.coreUtils.notification.email.findId(req, {
                successRedirect: req.body.successRedirect,
                errorRedirect: req.body.errorRedirect
            },req.loadedUser, function (status, data) {
                if (status == 204) {
                    next();
                } else {
                    res.hjson(req, next, 503);
                }
            });
        } else if (req.body.type == USER.authEmailFindPass) {
            req.coreUtils.notification.email.findPass(req, {
                successRedirect: req.body.successRedirect,
                errorRedirect: req.body.errorRedirect
            }, req.auth, function (status, data) {
                if (status == 204) {
                    next();
                } else {
                    res.hjson(req, next, 503);
                }
            });
        } else if (req.body.type == USER.authEmailSignup) {
            req.coreUtils.notification.email.signup(req, {
                successRedirect: req.body.successRedirect,
                errorRedirect: req.body.errorRedirect
            }, req.auth, req.loadedUser, function (status, data) {
                if (status == 204) {
                    next();
                } else {
                    res.hjson(req, next, 503);
                }
            });
        } else {
            return res.json(req, next, 500);
        }
    };
};

post.supplement = function () {
    return function (req, res, next) {
        var USER = req.meta.std.user;
        if (process.env.NODE_ENV == 'test') {
            if (req.body.type == USER.authEmailFindId) {
                res.hjson(req, next, 200, {aid:req.loadedUser.aid});
            } else {
                res.hjson(req, next, 200, req.auth.token);
            }
        } else {
            res.hjson(req, next, 204);
        }
    };
};

module.exports = post;
