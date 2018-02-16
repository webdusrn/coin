var gets = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var micro = require('microtime-nodejs');

gets.validate = function () {
    return function (req, res, next) {

        var COMMON = req.meta.std.common;
        var NOTICE = req.meta.std.notice;
        var enumCountry = req.coreUtils.common.getCountryEnum(req);

        if (req.query.size === undefined) req.query.size = COMMON.defaultLoadingLength;
        if (req.query.sort === undefined) req.query.sort = COMMON.DESC;

        if (req.query.country !== undefined) req.check('country', '400_28').isEnum(enumCountry);
        if (req.query.type !== undefined) req.check('type', '400_28').isEnum(NOTICE.enumNoticeTypes);
        if (req.query.sort !== undefined) req.check('sort', '400_28').isEnum(COMMON.enumSortTypes);
        if (req.query.today !== undefined) req.check('today', '400_18').isMicroTimestamp();
        if (req.query.last !== undefined) req.check('last', '400_18').isMicroTimestamp();

        req.check('size', '400_5').isInt({
            min: 1,
            max: COMMON.loadingMaxLength
        });

        if (req.query.offset !== undefined) req.check('offset', '400_5').isInt({
            min: 1
        });

        req.utils.common.checkError(req, res, next);
    };
};

gets.setParam = function () {
    return function (req, res, next) {
        req.models.Notice.findNoticesByOptions(req.query, function (status, data) {
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
        res.hjson(req, next, 200, req.data);
    };
};

module.exports = gets;
