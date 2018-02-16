var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

post.validate = function () {
    return function (req, res, next) {

        var NOTIFICATION = req.meta.std.notification;

        req.check('type', '400_3').isEnum(NOTIFICATION.enumNotificationTypes);

        req.check('isStored', '400_20').isBoolean();
        req.sanitize('isStored').toBoolean();
        req.check('isOption', '400_20').isBoolean();
        req.sanitize('isOption').toBoolean();

        req.check('key', '400_8').len(NOTIFICATION.minKeyLength, NOTIFICATION.maxKeyLength);
        req.check('title', '400_8').len(NOTIFICATION.minTitleLength, NOTIFICATION.maxTitleLength);
        req.check('body', '400_8').len(NOTIFICATION.minBodyLength, NOTIFICATION.maxBodyLength);
        req.check('data', '400_8').len(NOTIFICATION.minDataLength, NOTIFICATION.maxDataLength);
        req.check('img', '400_8').len(NOTIFICATION.minImgLength, NOTIFICATION.maxImgLength);
        req.check('description', '400_8').len(NOTIFICATION.minDescriptionLength, NOTIFICATION.maxDescriptionLength);

        req.utils.common.checkError(req, res, next);
    };
};

post.setParam = function () {
    return function (req, res, next) {
        var instance = req.models.Notification.build(req.body);
        instance.create(function (status, data) {
            if (status == 200) {
                req.instance = data;
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

post.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.instance);
    };
};

module.exports = post;
