var gets = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

gets.validate = function () {
    return function (req, res, next) {
        var COMMON = req.meta.std.common;
        var USER = req.meta.std.user;
        var ARTICLE = req.meta.std.article;

        req.check('slug', '400_8').isAlphanumeric();
        if (req.query.categoryId !== undefined) req.check('categoryId', '400_12').isInt();
        if (req.query.authorId !== undefined) req.check('authorId', '400_12').isInt();
        if (req.query.loadType !== undefined) {
            req.check('loadType', '400_3').isEnum(COMMON.enumLoadTypes);
        } else {
            req.query.loadType = COMMON.loadTypePage;
        }

        if (req.query.size === undefined) req.query.size = COMMON.defaultLoadingLength;
        req.check('size', '400_5').isInt();
        if (req.query.loadType == COMMON.loadTypeBlog) {
            if (req.query.last === undefined) req.query.last = new Date();
            req.check('last', '400_18').isDate();
        } else {
            if (req.query.last === undefined) req.query.last = 0;
            req.check('last', '400_5').isInt();
        }

        //if (req.query.nick !== undefined) req.check('nick', '400_8').len(USER.minNickLength, USER.maxNickLength);
        if (req.query.title !== undefined) req.check('title', '400_8').len(ARTICLE.minTitleLength, ARTICLE.maxTitleLength);

        req.utils.common.checkError(req, res, next);
    };
};

gets.loadBoard = function () {
    return function (req, res, next) {
        if (!req.user) req.user = {};
        req.models.Board.findBoardBySlug(
            req.user.role,
            req.query.slug,
            null, function (status, data) {
                if (status == 200) {
                    req.board = data;
                    next();
                } else {
                    res.hjson(req, next, status, data);
                }
            });
    };
};

gets.loadArticles = function () {
    return function (req, res, next) {

        function callback(status, data) {
            if (status == 200) {
                req.articles = data;
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        }

        var categoryIds = [];
        var categories = req.board.categories;
        for (var i = 0 ; i < categories.length; ++ i ) {
            categoryIds.push(categories[i].id);
        }

        req.categoryIds = categoryIds;

        if (req.query.loadType == req.meta.std.common.loadTypeBlog) {
            req.models.Article.findAllArticlesForBlog(
                req.user.role,
                req.query.categoryId || categoryIds,
                req.query.nick,
                req.query.title,
                req.query.size,
                req.query.last,
                callback
            );
        } else {
            req.models.Article.findAllArticlesForPage(
                req.user.role,
                req.query.categoryId || categoryIds,
                req.query.nick,
                req.query.title,
                req.query.size,
                req.query.last,
                callback
            );
        }
    };
};

gets.countArticles = function () {
    return function (req, res, next) {
        req.models.Article.countArticles(
            req.user.role,
            req.query.categoryId || req.categoryIds,
            false,
            req.query.nick,
            req.query.title,
            function (status, data) {
                req.articleCount = data;
                next();
            }
        );
    };
};

gets.supplement = function () {
    return function (req, res, next) {
        var categories = req.board.categories;
        delete req.board.categories;
        var ret = {
            board: req.board,
            categories: categories,
            rows: req.articles,
            count: req.articleCount,
            last: Number(req.query.last) + req.articles.length - 1
        };
        res.hjson(req, next, 200, req.articles);
    };
};

module.exports = gets;
