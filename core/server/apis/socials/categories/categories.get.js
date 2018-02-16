var get = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

get.validate = function () {
    return function (req, res, next) {
        req.check('id', '400_12').isInt();
        req.check('slug', '400_8').isAlphanumeric();
        req.utils.common.checkError(req, res, next);
    };
};

get.getCategory = function () {
    return function (req, res, next) {
        if (!req.user) req.user = {};
        req.models.Board.findBoardBySlug(req.user.role, req.query.slug, req.params.id, function (status, data) {
            if (status == 200) {
                req.data = data;
                if (!data.categories || data.categories.length != 1) {
                    return res.hjson(req, next, 404);
                }
                next();
            } else {
                res.hjson(req, next, status, data);
            }
        });
    };
};

get.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.data.categories[0]);
    };
};

module.exports = get;
