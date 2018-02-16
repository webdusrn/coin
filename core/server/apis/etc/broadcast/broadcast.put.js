var put = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

put.validate = function () {
    return function (req, res, next) {
        var NOTIFICATION = req.meta.std.notification;
        req.check('key', '400_8').len(NOTIFICATION.minKeyLength, NOTIFICATION.maxKeyLength);

        if (req.body.type !== undefined) req.check('type', '400_3').isEnum(NOTIFICATION.enumNotificationTypes);

        if (req.body.isStored !== undefined) {
            req.check('isStored', '400_20').isBoolean();
            req.sanitize('isStored').toBoolean();
        }

        if (req.body.isOption !== undefined) {
            req.check('isOption', '400_20').isBoolean();
            req.sanitize('isOption').toBoolean();
        }

        if (req.body.title !== undefined) req.check('title', '400_8').len(NOTIFICATION.minTitleLength, NOTIFICATION.maxTitleLength);
        if (req.body.body !== undefined) req.check('body', '400_8').len(NOTIFICATION.minBodyLength, NOTIFICATION.maxBodyLength);
        if (req.body.data !== undefined) req.check('data', '400_8').len(NOTIFICATION.minDataLength, NOTIFICATION.maxDataLength);
        if (req.body.img !== undefined) req.check('img', '400_8').len(NOTIFICATION.minImgLength, NOTIFICATION.maxImgLength);
        if (req.body.description !== undefined) req.check('description', '400_8').len(NOTIFICATION.minDescriptionLength, NOTIFICATION.maxDescriptionLength);
        req.utils.common.checkError(req, res, next);
    };
};

put.updateReport = function () {
    return function (req, res, next) {
        req.models.Notification.updateDataByKey('key', req.params.key, req.body, function (status, data) {
            if (status == 200) {
                req.data = data;
                next();
            } else {
                res.hjson(req, next, status, data);
            }
        });
    };
};

put.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.data);
    };
};

module.exports = put;
