var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

post.validate = function () {
    return function (req, res, next) {
        var USER = req.meta.std.user;
        req.check('type', '400_1').isEnum(USER.enumLinkIdPassTypes);
        if (req.body.type == USER.linkIdPassEmail) {
            req.check('id', '').isEmail();
        } else if (req.body.type == USER.linkIdPassNormal) {
            req.check('id', '400_55').isId(USER.minIdLength, USER.maxIdLength);
        }
        req.check('pass', '400_2').isAlphanumericPassword(USER.minSecretLength, USER.maxSecretLength);
        req.utils.common.checkError(req, res, next);
    };
};

post.updateAccount = function () {
    return function (req, res, next) {
        req.user.updateUniqueAccount(req.body.type, req.body.id, req.body.pass, function (status, data) {
            if (status == 200) {
                next();
            } else {
                res.hjson(req, next, status, data);
            }
        })
    };
};

post.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.user.toSecuredJSON());
    };
};

module.exports = post;
