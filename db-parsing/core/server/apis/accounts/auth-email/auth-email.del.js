var del = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

del.validate = function () {
    return function (req, res, next) {
        req.check('id', '400_12').isInt();
        req.utils.common.checkError(req, res, next);
    };
};

del.removeEmail = function () {
    return function (req, res, next) {
        if (req.loadedUser.email) {
            req.loadedUser.updateFields({
                email: null,
                isVerifiedEmail: req.config.flag.isAutoVerifiedEmail
            }, function (status, data) {
                if (status == 200) {
                    next();
                } else {
                    res.hjson(req, next, status, data);
                }
            });
        } else {
            res.hjson(req, next, 403);
        }
    };
};

del.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.loadedUser.toSecuredJSON());
    };
};

module.exports = del;
