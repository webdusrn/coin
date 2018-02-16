var gets = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

gets.validate = function () {
    return function (req, res, next) {

        if (req.query.key !== undefined) {
            req.utils.common.toArray(req.query, 'key');
        }

        req.utils.common.checkError(req, res, next);
    };
};

gets.getNewNotificationCount = function () {
    return function (req, res, next) {

        req.data = {};

        req.models.NotificationBox.findNewNotificationCount(req.user.id, req.query, function (status, data) {
            if (status == 200) {
                req.data.newNotificationCount = data;
                next();
            } else {
                res.hjson(req, next, status, data);
            }
        });
    };
};

gets.getNewChatMessageCount = function () {
    return function (req, res, next) {

        req.models.ChatRoomUser.getNewChatMessageCount(req.user.id, function (status, data) {
            if (status == 200 || status == 404) {
                req.data.newChatMessageCount = data;
                next();
            } else {
                res.hjson(req, next, status, data);
            }
        });
    };
};

gets.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.data);
    };
};

module.exports = gets;
