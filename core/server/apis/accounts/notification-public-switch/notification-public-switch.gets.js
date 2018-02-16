var gets = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

gets.validate = function () {
    return function (req, res, next) {
        var NOTIFICATION = req.meta.std.notification;

        req.check('userId', '400_12').isInt();
        req.check('sendType', '400_28').isEnum(NOTIFICATION.enumSendTypes);

        req.utils.common.checkError(req, res, next);
    };
};

gets.getNotificationSwitch = function () {
    return function (req, res, next) {

        var NOTIFICATION = req.meta.std.notification;
        var NOTIFICATIONS_PUBLIC = req.meta.notifications.public;

        var notificationPublicSwitch = [];

        req.models.NotificationPublicSwitch.findAll({
            where: {
                userId: req.query.userId,
                sendType: req.query.sendType
            },
            order: [['createdAt', 'ASC']]
        }).then(function (data) {

            for (var key in NOTIFICATIONS_PUBLIC) {

                if (NOTIFICATIONS_PUBLIC[key] && key != NOTIFICATION.notificationTypeEmergency) {

                    if (NOTIFICATIONS_PUBLIC[key].isOption) {

                        for (var sendTypeKey in NOTIFICATIONS_PUBLIC[key].sendTypes) {
                            if (sendTypeKey == req.query.sendType) {

                                var isSwitchOn = true;

                                for (var i = 0; i < data.length; i++) {
                                    if (key == data[i].key) {
                                        isSwitchOn = false;
                                        data.splice(i, 1);
                                    }
                                }

                                notificationPublicSwitch.push({
                                    key: NOTIFICATIONS_PUBLIC[key].key,
                                    title: NOTIFICATIONS_PUBLIC[key].boxTitle,
                                    sendType: req.query.sendType,
                                    switch: isSwitchOn
                                });
                            }
                        }

                    }

                }
            }

            req.data = notificationPublicSwitch;
            next();

        });
    };
};

gets.supplement = function () {
    return function (req, res, next) {
        var ret = {
            count: req.data.length,
            rows: req.data
        };

        res.hjson(req, next, 200, ret);
    };
};

module.exports = gets;
