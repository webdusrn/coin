var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

post.validate = function () {
    return function (req, res, next) {
        var COMMENT = req.meta.std.comment;
        req.check('slug', '400_8').isAlphanumeric();
        req.check('categoryId', '400_2').isInt();
        req.check('articleId', '400_2').isInt();
        if (req.body.parentId !== undefined) {
            req.check('parentId', '400_2').isInt();
        }
        req.check('body', '400_8').len(COMMENT.minBodyLength, COMMENT.maxBodyLength);
        req.utils.common.checkError(req, res, next);
    };
};

post.loadBoard = function () {
    return function (req, res, next) {
        if (req.body.parentId !== undefined) {
            req.models.Board.findBoardAndArticleAndCommentBySlug(
                req.user.role,
                req.body.slug,
                req.body.categoryId,
                req.body.articleId,
                req.body.parentId, function (status, data) {
                    if (status == 200) {
                        req.board = data;
                        req.parentComment = data.categories[0].articles[0].comments[0];
                        next();
                    } else {
                        return res.hjson(req, next, status, data)
                    }
                });
        } else {
            req.models.Board.findBoardAndArticleBySlug(
                req.user.role,
                req.body.slug,
                req.body.categoryId,
                req.body.articleId, function (status, data) {
                    if (status == 200) {
                        req.board = data;
                        req.parentComment = null;
                        next();
                    } else {
                        return res.hjson(req, next, status, data)
                    }
                });
        }
    };
};

post.createComment = function () {
    return function (req, res, next) {
        req.body.ip = req.refinedIP;
        req.body.authorId = req.user.id;
        req.models.Comment.createComment(req.body, req.parentComment, function (status, data) {
            if (status == 200) {
                req.comment = data;
                next();
            }
            else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

post.supplement = function () {
    return function (req, res, next) {
        req.comment.dataValues.author = {
            nick: req.user.nick,
            id: req.user.id
        };

        res.hjson(req, next, 201, req.comment);
    };
};

module.exports = post;
