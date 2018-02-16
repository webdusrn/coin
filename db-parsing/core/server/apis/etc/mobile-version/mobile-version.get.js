var get = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

get.validate = function () {
    return function (req, res, next) {
        var USER = req.meta.std.user;

        req.check('type', '400_3').isEnum(USER.enumPhones);

        req.check('majorVersion', '400_51').len(1, 2);
        req.check('minorVersion', '400_51').len(1, 2);
        req.check('hotfixVersion', '400_51').len(1, 2);

        req.utils.common.checkError(req, res, next);
    };
};

get.setParams = function () {
    return function (req, res, next) {
        req.models.MobileVersion.findMobileVersionByType(req.query.type, req.query.majorVersion, req.query.minorVersion, req.query.hotfixVersion, function (status, data) {
            if (status == 200) {
                req.data = data;
                next();
            } else {
                res.hjson(req, next, status, data);
            }
        });
    }
};

get.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.data);
    };
};

module.exports = get;
