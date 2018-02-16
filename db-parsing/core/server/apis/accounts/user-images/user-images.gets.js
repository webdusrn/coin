var gets = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var micro = require('microtime-nodejs');

gets.validate = function () {
    return function (req, res, next) {
        var POST_IMAGE = req.meta.std.postImage;
        var COMMON = req.meta.std.common;

        if (req.query.last === undefined) req.query.last = micro.now();
        if (req.query.size === undefined) req.query.size = req.meta.std.common.defaultLoadingLength;
        req.check('last', '400_18').isMicroTimestamp();
        req.check('size', '400_5').isInt();

        if (req.query.offset === undefined) {
            req.query.offset = 0;
        } else {
            req.check('offset', '400_5').isInt();
        }

        if (req.query.orderBy === undefined) {
            req.query.orderBy = POST_IMAGE.defaultOrderBy;
        } else {
            req.check('orderBy', '400_3').isEnum(POST_IMAGE.orderBy);
        }

        if (req.query.sort === undefined) {
            req.query.sort = COMMON.ASC;
        } else {
            req.check('sort', '400_3').isEnum(COMMON.enumSortTypes);
        }

        if (req.query.userId !== undefined) {
            req.check('userId', '400_12').isInt();
        }

        req.utils.common.checkError(req, res, next);
    };
};

gets.setParam = function () {
    return function (req, res, next) {
        req.models.UserImage.findAppUserImagesByOption(
            req.query,
            function (status, data) {
                if (status == 200) {
                    req.data = data;
                    next();
                } else {
                    res.hjson(req, next, status, data);
                }
            }
        );
    };
};

gets.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.data);
    };
};

module.exports = gets;
