var get = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

get.validate = function () {
    return function (req, res, next) {
        req.check('id', '400_12').isInt();
        req.utils.common.checkError(req, res, next);
    };
};

get.loadBoardAndComment = function () {
    return function (req, res, next) {
        if (!req.user) req.user = {};
        req.models.Board.findBoardAndArticleAndCommentBySlug(
            req.user.role,
            req.query.slug,
            req.query.categoryId,
            req.query.articleId, req.params.id, function (status, data) {

                if (status == 200) {
                    req.board = data;
                    req.comment = data.categories[0].articles[0].comments[0];
                    next();
                } else {
                    res.hjson(req, next, status, data);
                }
            });
    };
};

get.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.comment);
    };
};

module.exports = get;
