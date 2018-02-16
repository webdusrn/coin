var put = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

put.validate = function () {
    return function (req, res, next) {

        var NOTIFICATION = req.meta.std.notification;

        req.check('userId', '400_12').isInt();
        req.check('sendType', '400_28').isEnum(NOTIFICATION.enumSendTypes);
        req.check('switch', '400_20').isBoolean();
        req.sanitize('switch').toBoolean();

        req.utils.common.checkError(req, res, next);
    };
};

put.validateKey = function () {
    return function (req, res, next) {
        var NOTIFICATIONS_PUBLIC = req.meta.notifications.public;

        if (!NOTIFICATIONS_PUBLIC[req.body.key]) {
            return res.hjson(req, next, 400, {
                code: '400_3'
            });
        }

        if (!NOTIFICATIONS_PUBLIC[req.body.key].isOption) {
            return res.hjson(req, next, 400, {
                code: '400_3'
            });
        }

        next();
    }
};

put.update = function () {
    return function (req, res, next) {

        var body = {
            userId: req.body.userId,
            key: req.body.key,
            sendType: req.body.sendType
        };

        if (req.body.switch) {

            req.models.NotificationPublicSwitch.deleteNotificationPublicSwitch(body, function (status, data) {
                if (status == 204) {
                    next();
                } else {
                    return res.hjson(req, next, status, data);
                }

            });

        } else {

            var instance = req.models.NotificationPublicSwitch.build(body);
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
};

put.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 204);
    };
};

module.exports = put;
