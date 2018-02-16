var gets = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var micro = require('microtime-nodejs');

gets.validate = function () {
    return function (req, res, next) {
        var COMMON = req.meta.std.common;

        if (req.query.searchItem === undefined) req.query.searchItem = '';
        if (req.query.option === undefined) req.query.option = '';
        if (req.query.last === undefined) req.query.last = micro.now();
        if (req.query.size === undefined) req.query.size = COMMON.defaultLoadingLength;

        if (req.query.isVisible !== undefined) {
            req.check('isVisible', '400_20').isBoolean();
            req.sanitize('isVisible').toBoolean();
        }

        if (req.query.isAnonymous !== undefined) {
            req.check('isAnonymous', '400_20').isBoolean();
            req.sanitize('isAnonymous').toBoolean();
        }

        if (req.query.sort !== undefined) {
            req.check('sort', '400_28').isEnum(COMMON.enumSortTypes);
        } else {
            req.query.sort = COMMON.enumSortTypes[0];
        }

        req.check('last', '400_18').isMicroTimestamp();
        req.check('size', '400_5').isInt({min: 1, max: COMMON.loadingMaxLength});

        req.utils.common.checkError(req, res, next);
    };
};

gets.setParam = function () {
    return function (req, res, next) {
        if (!req.user) req.user = {};

        req.models.Board.findBoardsByOptions(req.query, function (status, data) {
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