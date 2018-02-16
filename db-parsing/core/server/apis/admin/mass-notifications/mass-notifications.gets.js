var gets = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var MICRO = require('microtime-nodejs');

gets.validate = function(){
    return function(req, res, next){
        var COMMON = req.meta.std.common;
        var NOTIFICATION = req.meta.std.notification;
        var NOTIFICATIONS = req.meta.notifications;
        if (req.query.orderBy === undefined) req.query.orderBy = NOTIFICATION.defaultOrderBy;
        if (req.query.sort === undefined) req.query.sort = COMMON.DESC;
        if (req.query.size === undefined) req.query.size = COMMON.loadingMaxLength;
        if (req.query.last === undefined) {
            if (req.query.sort === COMMON.DESC) {
                req.query.last = MICRO.now();
            } else {
                req.query.last = 0;
            }
        }

        if (req.query.searchField !== undefined) req.check("searchField", "400_3").isEnum(NOTIFICATION.enumSearchFields);
        if (req.query.searchItem !== undefined) req.check("searchItem", "400_8").len(COMMON.wordMinLength, COMMON.wordMaxLength);
        if (req.query.orderBy !== undefined) req.check("orderBy", "400_3").isEnum(NOTIFICATION.enumOrderBys);
        if (req.query.sort !== undefined) req.check("sort", "400_3").isEnum(COMMON.enumSortTypes);
        if (req.query.last !== undefined) req.check("last", "400_18").isMicroTimestamp();
        if (req.query.size !== undefined) req.check("size", "400_5").isInt({
            min: 1,
            max: COMMON.loadingMaxLength
        });
        if (req.query.key !== undefined) req.check("key", "400_3").isEnum(Object.keys(NOTIFICATIONS.public));
        if (req.query.sendType !== undefined) req.check("sendType", "400_3").isEnum(NOTIFICATION.enumSendTypes);
        if (req.query.isStored !== undefined) {
            req.check("isStored", "400_20").isBoolean();
            req.sanitize("isStored").toBoolean();
        }
        req.utils.common.checkError(req, res, next);
    };
};

gets.setParam = function() {
    return function(req, res, next) {
        req.models.MassNotification.findMassNotificationsByOptions(req.query, function (status, data) {
            if (status == 200) {
                req.data = data;
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

gets.supplement = function(){
    return function(req, res, next){
        res.hjson(req, next, 200, req.data);
    };
};

module.exports = gets;
