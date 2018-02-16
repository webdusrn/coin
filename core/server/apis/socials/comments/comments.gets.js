var gets = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

gets.validate = function(){
    return function(req, res, next) {
        var COMMON = req.meta.std.common;
        req.check('slug', '400_8').isAlphanumeric();
        req.check('categoryId', '400_12').isInt();
        req.check('articleId', '400_12').isInt();
        if (req.query.authorId !== undefined) req.check('authorId', '400_12').isInt();
        if (req.query.size === undefined) req.query.size = COMMON.defaultLoadingLength;
        if (req.query.last === undefined) req.query.last = 99999999999;
        req.check('size', '400_5').isInt();
        req.check('last', '400_5').isFloat();
        req.sanitize('size').toFloat();
        req.sanitize('last').toInt();

        req.utils.common.checkError(req, res, next);
    };
};

gets.loadBoard = function () {
    return function (req, res, next) {
        if (!req.user) req.user = {};
        req.models.Board.findBoardAndArticleBySlug(
            req.user.role,
            req.query.slug,
            req.query.categoryId,
            req.query.articleId, function (status, data) {

                if (status == 200) {
                    req.board = data;
                    next();
                } else {
                    res.hjson(req, next, status, data);
                }
            });
    };
};

gets.loadComments = function () {
    return function (req, res, next) {
        req.models.Comment.findAllCommentsForBlog(
            req.query.articleId,
            req.query.authorId,
            req.query.size,
            req.query.last, function (status, data) {
            if (status == 200) {
                req.comments = data;
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

gets.supplement = function(){
    return function(req, res, next){
        var ret = {
            rows: req.comments
        };
        res.hjson(req, next, 200, req.comments);
    };
};

module.exports = gets;
