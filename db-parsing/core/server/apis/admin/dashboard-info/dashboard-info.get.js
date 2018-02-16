var get = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var MICRO = require('microtime-nodejs');
get.validate = function () {
    return function (req, res, next) {

        req.check('timeZoneOffset', '400_71').isInt();
        req.check('year', '400_35').isYear();
        req.check('month', '400_36').isMonth();
        req.check('day', '400_37').isDay();

        req.utils.common.checkError(req, res, next);
    };
};

get.parseTimeZoneOffset = function () {
    return function (req, res, next) {

        var str = req.query.timeZoneOffset;
        var offsetTime = parseInt(str);
        offsetTime = offsetTime / 60;
        offsetTime = offsetTime + '';
        var arr = offsetTime.split('');

        if (arr[0] = '-') {
            arr[0] = '+';
        } else {
            arr.unshift('-');
        }

        if (arr.length == 2) {
            arr.splice(1, 0, "0");
        }

        offsetTime = arr.join('');

        offsetTime = offsetTime + ':00';
        req.query.timeZoneOffset = offsetTime;

        next();
    }
};

get.getUsersStatus = function () {
    return function (req, res, next) {
        req.data = {};

        req.models.User.getUsersStatus(req.query.timeZoneOffset, req.query.year, req.query.month, req.query.day,
            function (status, data) {
                if (status == 200) {
                    req.data.usersStatus = data;
                    next();
                } else {
                    res.hjson(req, next, status, data);
                }
            }
        );
    };
};

get.getUsersStatusByMonth = function () {
    return function (req, res, next) {

        req.models.User.getUsersStatusByMonth(req.query.timeZoneOffset, req.query.year, req.query.month, req.query.day,
            function (status, data) {
                if (status == 200) {
                    req.data.usersStatusByMonth = data;
                    next();
                } else {
                    res.hjson(req, next, status, data);
                }
            });

    };
};

get.getUserAgeGroup = function () {
    return function (req, res, next) {
        req.models.User.getUserAgeGroup(req.query.timeZoneOffset, function (status, data) {
            if (status == 200) {
                req.data.userAgeGroup = data;
                next();
            } else {
                req.hjson(req, next, status, data);
            }
        });
    };
};

get.getReportsStatus = function () {
    return function (req, res, next) {

        req.models.Report.getReportsStatus(req.query.timeZoneOffset, req.query.year, req.query.month, req.query.day,
            function (status, data) {
                if (status == 200) {
                    req.data.reportsStatus = data;
                    next();
                } else {
                    res.hjson(req, next, status, data);
                }
            }
        );
    };
};

get.getReportsStatusByMonth = function () {
    return function (req, res, next) {

        req.models.Report.getReportsStatusByMonth(req.query.timeZoneOffset, req.query.year, req.query.month, req.query.day,
            function (status, data) {
                if (status == 200) {
                    req.data.reportsStatusByMonth = data;
                    next();
                } else {
                    res.hjson(req, next, status, data);
                }
            }
        );
    };
};

get.getImagesStatus = function () {
    return function (req, res, next) {

        req.models.Image.getImagesStatus(
            function (status, data) {
                if (status == 200) {
                    req.data.imagesStatus = data;
                    next();
                } else {
                    res.hjson(req, next, status, data);
                }
            }
        );
    };
};

get.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.data);
    };
};

module.exports = get;
