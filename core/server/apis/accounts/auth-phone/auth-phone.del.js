var del = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

del.validate = function () {
    return function (req, res, next) {
        req.check('id', '400_12').isInt();

        // 아이디 비번 로그인, 소셜로그인도 불가능할 경우
        if (!req.loadedUser.aid && (!req.loadedUser.providers || req.loadedUser.providers.length == 0)) {
            return res.hjson(req, next, 400, {
                code: '400_50'
            });
        }

        req.utils.common.checkError(req, res, next);
    };
};

del.removePhone = function () {
    return function (req, res, next) {
        req.loadedUser.removePhoneNumber(function(status, data) {
            if (status == 200) {
                next();
            } else {
                res.hjson(req, next, status, data);
            }
        });
    };
};

del.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.loadedUser.toSecuredJSON());
    };
};

module.exports = del;
