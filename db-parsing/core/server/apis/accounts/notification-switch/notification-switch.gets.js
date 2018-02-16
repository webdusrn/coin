var gets = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var MICRO = require('microtime-nodejs');

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

        var NOTIFICATIONS = req.meta.notifications;
        var notificationSwitch = [];

        req.models.NotificationSwitch.findAll({
            where: {
                userId: req.query.userId,
                sendType: req.query.sendType
            }
        }).then(function (data) {

            for (var key in NOTIFICATIONS) {
                if (NOTIFICATIONS[key] && key != 'public') {

                    if (NOTIFICATIONS[key].isOption) {
                        for (var sendTypeKey in NOTIFICATIONS[key].sendTypes) {
                            if (sendTypeKey == req.query.sendType) {

                                var isSwitchOn = true;

                                for (var i = 0; i < data.length; i++) {
                                    if (key == data[i].key) {
                                        isSwitchOn = false;
                                        data.splice(i, 1);
                                    }
                                }

                                notificationSwitch.push({
                                    key: NOTIFICATIONS[key].key,
                                    title: NOTIFICATIONS[key].boxTitle,
                                    sendType: req.query.sendType,
                                    switch: isSwitchOn
                                });

                            }
                        }
                    }

                }
            }

            req.data = notificationSwitch;
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
