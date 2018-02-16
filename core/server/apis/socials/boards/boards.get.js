var get = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

get.validate = function () {
    return function (req, res, next) {
        req.check('slug', '400_8').isAlphanumeric();
        req.utils.common.checkError(req, res, next);
    };
};

get.loadBoard = function () {
    return function (req, res, next) {
        if (!req.user) req.user = {};
        req.models.Board.findBoardBySlug(req.user.role, req.params.slug, null, function (status, data) {
            if (status == 200) {
                req.board = data;
                next();
            } else {
                res.hjson(req, next, status, data);
            }
        });
    };
};

get.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.board);
    };
};

module.exports = get;
