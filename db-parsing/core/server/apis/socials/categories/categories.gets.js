var gets = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var micro = require('microtime-nodejs');

gets.validate = function () {
    return function (req, res, next) {
        if (req.query.last === undefined) req.query.last = micro.now();
        if (req.query.size === undefined) req.query.size = req.meta.std.common.defaultLoadingLength;
        req.check('last', '400_18').isMicroTimestamp();
        req.check('size', '400_5').isInt();
        req.check('slug', '400_8').isAlphanumeric();
        req.utils.common.checkError(req, res, next);
    };
};

gets.loadBoardAndCategories = function () {
    return function (req, res, next) {
        if (!req.user) req.user = {};
        req.models.Board.findBoardBySlug(req.user.role, req.query.slug, null, function (status, data) {
            if (status == 200) {
                req.data = data;
                if (!data.categories || data.categories.length == 0) {
                    return res.hjson(req, next, 404);
                }
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

gets.supplement = function () {
    return function (req, res, next) {
        var ret = {
            rows: req.data.categories
        };
        res.hjson(req, next, 200, req.data.categories);
    };
};

module.exports = gets;
