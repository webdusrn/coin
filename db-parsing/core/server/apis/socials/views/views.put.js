var put = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

put.validate = function () {
    return function (req, res, next) {
        req.check('slug', '400_8').isAlphanumeric();
        req.check('categoryId', '400_3').isInt();
        req.check('articleId', '400_3').isInt();

        req.utils.common.checkError(req, res, next);
    };
};

put.loadBoard = function () {
    return function (req, res, next) {
        if (req.body.slug) {
            if (!req.user) req.user = {};
            req.models.Board.findBoardAndArticleBySlug(
                req.user.role,
                req.body.slug,
                req.body.categoryId,
                req.body.articleId, function (status, data) {
                    if (status == 200) {

                        req.board = data;
                        req.article = data.categories[0].articles[0];
                        // 공지사항을 쓸때 권한 확인
                        if (req.body.isNotice == true && req.user.role < req.meta.std.user.roleAdmin) {
                            return res.hjson(req, next, 401);
                        }
                        next();
                    } else {
                        return res.hjson(req, next, status, data);
                    }
                });
        } else {
            next();
        }
    };
};

put.updateArticle = function () {
    return function (req, res, next) {
        req.article.increment('views');
        next();
    };
};

put.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 204);
    };
};

module.exports = put;
