var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

post.validate = function () {
    return function (req, res, next) {
        var USER = req.meta.std.user;

        req.check('phoneNum', '400_7').len(5, 18);
        req.check('type', '400_3').isEnum(req.meta.std.user.enumAuthPhoneTypes);

        // 연동일 경우 무조건 로그인이 되어 있어야한다.
        if (req.body.type == USER.authPhoneAdding && !req.isAuthenticated()) {
            return res.hjson(req, next, 401);
        }

        req.utils.common.checkError(req, res, next);
    };
};

post.checkPhoneNumber = function () {
    return function (req, res, next) {
        var USER = req.meta.std.user;

        req.models.User.findUserByPhoneNumber(req.body.phoneNum, function(status, data) {

            // 연동, 가입, 휴대폰번호변경은 번호가 없어야함
            if (req.body.type == USER.authPhoneSignup
                || req.body.type == USER.authPhoneAdding
                || req.body.type == USER.authPhoneChange) {
                // 유저가 없어야만 넘김.
                if (status == 404) {
                    return next();
                }
                // 유저가 이미 있으면 안됨.
                else if (status == 200) {
                    return res.hjson(req, next, 409, {
                        code: '409_1'
                    });
                }
            }
            // 그외 로그인 비번찾기의 경우 유저가 없으면 안된다.
            else {
                // 유저가 있어야만 넘김.
                if (status == 200) {
                    return next();
                }
                // 유저가 없다면 에러.
                else if (status == 404) {
                    return res.hjson(req, next, 404, {
                        code: '404_2'
                    });
                }
            }

            return res.hjson(req, next, status, data);
        });
    };
};

post.createToken = function () {
    return function (req, res, next) {

        var USER = req.meta.std.user;
        var data = {
            type: req.body.type,
            key: req.body.phoneNum
        };

        if (req.body.type == USER.authPhoneAdding) {
            data.userId = req.user.id;
        }

        req.models.Auth.upsertAuth(data, function(status, data) {
            if (status == 200) {
                req.authNum = data.token;
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

post.sendSMS = function () {
    return function (req, res, next) {
        if (!req.config.flag.isAutoVerifiedAuthPhone || process.env.NODE_ENV != 'development') {
            req.coreUtils.notification.sms.sendAuth(req, req.body.phoneNum, req.authNum, function (status, data) {
                if (status == 204) {
                    next();
                } else if (status == 400) {
                    return res.hjson(req, next, 400, {code: '400_7'});
                } else {
                    return res.hjson(req, next, 500);
                }
            });
        } else {
            next();
        }
    };
};

post.supplement = function () {
    return function (req, res, next) {
        if (process.env.NODE_ENV == 'test') {
            res.hjson(req, next, 200, req.authNum);
        } else {
            res.hjson(req, next, 204);
        }
    };
};

module.exports = post;
