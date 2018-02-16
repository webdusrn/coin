var gets = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var MICRO = require('microtime-nodejs');

gets.validate = function () {
    return function (req, res, next) {

        var NOTIFICATION = req.meta.std.notification;

        if (req.query.type !== undefined) {
            req.check('type', '400_3').isEnum(NOTIFICATION.enumNotificationTypes);
        }

        if (req.query.isStored !== undefined) {
            req.check('isStored', '400_20').isBoolean();
            req.sanitize('isStored').toBoolean();
        }
        if (req.query.isOption !== undefined) {
            req.check('isOption', '400_20').isBoolean();
            req.sanitize('isOption').toBoolean();
        }

        req.utils.common.checkError(req, res, next);
    };
};

gets.setParam = function () {
    return function (req, res, next) {
        var where = {};

        if (req.query.isStored !== undefined) where.isStored = req.query.isStored;
        if (req.query.isOption !== undefined) where.isOption = req.query.isOption;
        if (req.query.type !== undefined) where.type = req.query.type;

        req.models.Test.findAllDataForQuery({
            where: where
        }, function (status, data) {
            req.data = data;
            next();
        });
    };
};

gets.supplement = function () {
    return function (req, res, next) {
        var ret = {
            rows: req.data
        };
        res.hjson(req, next, 200, ret);
    };
};

module.exports = gets;
