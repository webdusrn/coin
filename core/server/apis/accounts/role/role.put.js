var put = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

put.validate = function () {
    return function (req, res, next) {
        var USER = req.meta.std.user;
        req.check('userId', '400_12').isInt();
        req.check('role', '400_3').isEnum(USER.enumRoles);
        req.utils.common.checkError(req, res, next);
    };
};

put.updateUser = function () {
    return function (req, res, next) {

        req.models.User.updateDataById(req.body.userId, {
            role: req.body.role
        }, function (status, data) {
            if (status == 200) {
                req.data = data;
                next();
            } else {
                res.hjson(req, next, status, data);
            }
        });
    };
};

put.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.data);
    };
};

module.exports = put;
