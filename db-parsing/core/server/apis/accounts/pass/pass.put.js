var put = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

put.validate = function () {
    return function (req, res, next) {
        var USER = req.meta.std.user;
        req.check('newPass', '400_2').isAlphanumericPassword(USER.minSecretLength, USER.maxSecretLength);
        req.check('type', '400_2').isEnum(USER.enumLinkIdPassTypes);
        req.check('token', '400_2').len(1, 2000);

        if (req.body.email !== undefined) {
            req.check('email', '400_1').isEmail();
        }

        // 이메일로 비번을 찾을려는 경우 반드시 이메일이 필요하다.
        if (req.body.type == USER.linkIdPassEmail && req.body.email === undefined) {
            return res.hjson(req, next, 400, {
                code: '400_14'
            });
        }

        if (!req.isAuthenticated() && req.body.type == USER.linkIdPassNormal) {
            return res.hjson(req, next, 403);
        }

        req.utils.common.checkError(req, res, next);
    };
};

put.checkToken = function () {
    return function (req, res, next) {
        var USER = req.meta.std.user;

        // 이메일 token값을 갖고 비번을 초기화 하는 경우.
        if (req.body.type == USER.linkIdPassEmail) {
            req.models.Auth.findDataIncluding({
                type: USER.authEmailFindPass,
                key: req.body.email,
                token: req.body.token
            }, null, function (status, data) {
                if (status == 200) {
                    var now = new Date();
                    if (data.expiredAt < now || data.token.toString() != req.body.token.toString()) {
                        data.delete(function (status, data) {
                        });
                        return res.hjson(req, next, 403, {
                            code: '403_1'
                        });
                    }
                    req.loadedAuth = data;
                    next();
                } else {
                    res.hjson(req, next, status, data);
                }
            });
        }
        // 일반 비번 변경인 경우
        else {
            if (req.user.authenticate(req.body.token)) {
                next();
            } else {
                return res.hjson(req, next, 403, {
                    code: '403_1'
                });
            }
        }
    };
};

put.loadUser = function () {
    return function (req, res, next) {
        if (req.body.type == req.meta.std.user.linkIdPassEmail) {
            req.models.User.findUserByEmail(req.body.email, function (status, data) {
                if (status == 200) {
                    req.user = data;
                    next();
                } else {
                    res.hjson(req, next, status, data);
                }
            });
        } else {
            next();
        }
    };
};

put.changePassword = function () {
    return function (req, res, next) {
        req.user.changePassword(req.body.newPass, function (status, data) {
            if (status == 200) {
                req.user = data;
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

put.removeAuth = function () {
    return function (req, res, next) {
        var USER = req.meta.std.user;
        if (req.body.type == USER.linkIdPassEmail) {
            req.loadedAuth.delete(function (status, data) {
                next();
            });
        } else {
            next();
        }
    };
};

put.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 204);
    };
};

module.exports = put;
