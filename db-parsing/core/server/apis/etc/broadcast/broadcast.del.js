var del = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

del.validate = function () {
    return function (req, res, next) {
        var NOTIFICATION = req.meta.std.notification;
        req.check('key', '400_8').len(NOTIFICATION.minKeyLength, NOTIFICATION.maxKeyLength);
        req.utils.common.checkError(req, res, next);
    };
};

del.destroy = function () {
    return function (req, res, next) {
        req.models.Notification.destroyData({
            key: req.params.key
        }, function (status, data) {
            if (status == 204) {
                next();
            } else {
                res.hjson(req, next, status, data);
            }
        });
    };
};

del.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 204);
    };
};

module.exports = del;
