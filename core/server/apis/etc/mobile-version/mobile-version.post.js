var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

post.validate = function () {
    return function (req, res, next) {
        var USER = req.meta.std.user;

        req.check('type', '400_3').isEnum(USER.enumPhones);

        req.check('majorVersion', '400_51').len(1, 2);
        req.check('minorVersion', '400_51').len(1, 2);
        req.check('hotfixVersion', '400_51').len(1, 2);

        req.check('forceUpdate', '400_20').isBoolean();
        req.sanitize('forceUpdate').toBoolean();

        req.utils.common.checkError(req, res, next);
    };
};

post.setParams = function () {
    return function (req, res, next) {

        var body = req.body;
        var instance = req.models.MobileVersion.build(body);
        instance.create(function (status, data) {
            if (status == 200) {
                req.instance = data;
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    }
};

post.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.instance);
    };
};

module.exports = post;
