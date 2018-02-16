var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

post.validate = function () {
    return function (req, res, next) {
        var BOARD = req.meta.std.board;
        var CATEGORY = req.meta.std.category;
        req.check('slug', '400_8').isAlphanumeric().len(BOARD.minSlugLength, BOARD.maxSlugLength);;
        req.check('name', '400_8').len(CATEGORY.minNameLength, CATEGORY.maxNameLength);

        if (req.body.isVisible !== undefined) {
            req.check('isVisible', '400_20').isBoolean();
            req.sanitize('isVisible').toBoolean();
        }

        req.utils.common.checkError(req, res, next);
    };
};

post.loadBoard = function () {
    return function (req, res, next) {
        if (!req.user) req.user = {};
        req.models.Board.findBoardBySlug(
            req.user.role,
            req.body.slug, null, function (status, data) {
                if (status == 200) {
                    req.board = data;
                    next();
                } else {
                    res.hjson(req, next, status, data);
                }
            });
    };
};


post.create = function () {
    return function (req, res, next) {
        req.body.boardId = req.board.id;
        var instance = req.models.Category.build(req.body);
        instance.create(function (status, data) {
            if (status == 200) {
                req.instance = instance;
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

post.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 201, req.data);
    };
};

module.exports = post;
