var get = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

get.validate = function () {
    return function (req, res, next) {
        req.check('id', '400_12').isInt();
        req.check('slug', '400_8').isAlphanumeric();
        req.check('categoryId', '400_12').isInt();
        req.utils.common.checkError(req, res, next);
    };
};

get.loadBoard = function () {
    return function (req, res, next) {
        if (!req.user) req.user = {};
        req.models.Board.findBoardAndArticleBySlug(
            req.user.role,
            req.query.slug,
            req.query.categoryId, req.params.id, function (status, data) {

                if (status == 200) {
                    req.board = data;
                    req.article = data.categories[0].articles[0];
                    next();
                } else {
                    res.hjson(req, next, status, data);
                }
            });
    };
};

get.countComments = function () {
    return function (req, res, next) {
        req.models.Comment.countComments(req.article.id, function(status, data) {
            if (status == 200 || status == 404) {
                req.commentCount = data || 0;
            } else {
                return res.hjson(req, next, status, data);
            }
            next();
        });
    };
};

get.loadComments = function () {
    return function (req, res, next) {
        var COMMON = req.meta.std.common;
        req.models.Comment.findAllCommentsForBlog(
            req.article.id,
            null,
            COMMON.defaultLoadingLength,
            9999999999, function (status, data) {
                if (status == 200 || status == 404) {
                    req.comments = data || [];
                    next();
                } else {
                    return res.hjson(req, next, status, data);
                }
            });
    };
};

get.supplement = function () {
    return function (req, res, next) {
        if (!req.user) req.user = {};
        if (req.article.isVisible == false && req.article.authorId != req.user.id) {
            return res.hjson(req, next, 404);
        }

        var article = req.board.categories[0].articles[0];
        var category = req.board.categories[0];
        delete req.board.categories;

        var ret = {
            //board: req.board,
            object: article,
            //category: category,
            //commentCount: req.commentCount,
            //comments: req.comments
        };

        res.hjson(req, next, 200, ret);
    };
};

module.exports = get;
