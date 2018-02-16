var top = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

top.checkPhoneEditAuthorization = function () {
    return function (req, res, next) {
        if (req.body.phoneNum !== undefined && req.user.role < req.meta.std.user.roleAdmin) {
            res.hjson(req, next, 403);
        } else {
            next();
        }
    };
};


module.exports = top;
