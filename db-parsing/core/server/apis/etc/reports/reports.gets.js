var gets = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var micro = require('microtime-nodejs');

gets.validate = function () {
    return function (req, res, next) {
        var COMMON = req.meta.std.common;
        var REPORT = req.meta.std.report;

        if (req.query.searchItem === undefined) req.query.searchItem = '';
        if (req.query.searchField !== undefined) {
            req.check('searchField', '400_28').isEnum(REPORT.enumSearchFields);
        }
        if (req.query.last === undefined) {
            req.query.last = micro.now();
        }
        if (req.query.size === undefined) {
            req.query.size = COMMON.defaultLoadingLength;
        }
        req.check('last', '400_18').isMicroTimestamp();
        req.check('size', '400_5').isInt({min: 1, max: COMMON.loadingMaxLength});

        if (req.query.authorId !== undefined) {
            req.check('authorId', '400_12').isInt();
        }
        if (req.query.isSolved !== undefined) {
            req.check('isSolved', '400_20').isBoolean();
            req.sanitize('isSolved').toBoolean();
        }
        if (req.query.sort !== undefined) {
            req.check('sort', '400_28').isEnum(COMMON.enumSortTypes);
        } else {
            req.query.sort = COMMON.enumSortTypes[0];
        }

        req.utils.common.checkError(req, res, next);
    };
};

gets.setParam = function () {
    return function (req, res, next) {

        // 어드민이 아니라면 자신의 것만 볼수 있음.
        if (req.user.role < req.meta.std.user.roleAdmin) {
            req.query.authorId = req.user.id;
        }

        req.models.Report.findReportsByOptions(req.query, function (status, data) {
            if (status == 200) {
                req.data = data;
                next();
            } else {
                res.hjson(req, next, status, data);
            }
        });

    };
};

gets.supplement = function () {
    return function (req, res, next) {
        var ret = {
            rows: req.data
        };
        res.hjson(req, next, 200, req.data);
    };
};

module.exports = gets;
