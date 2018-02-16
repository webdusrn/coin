var get = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

get.validate = function () {
    return function (req, res, next) {
        var NOTIFICATION = req.meta.std.notification;

        req.check('key', '400_12').len(NOTIFICATION.minKeyLength, NOTIFICATION.maxKeyLength);

        req.utils.common.checkError(req, res, next);
    };
};

get.setParam = function () {
    return function (req, res, next) {
        req.models.Notification.findDataIncluding({
            key: req.params.key
        }, null, function (status, data) {
            if (status == 200) {
                req.data = data;
                next();
            } else {
                res.hjson(req, next, status, data);
            }
        });
    };
};

get.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.data);
    };
};

module.exports = get;
