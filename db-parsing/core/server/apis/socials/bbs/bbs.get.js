var get = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

get.validate = function () {
    return function (req, res, next) {
        var COMMON = req.meta.std.common;

        req.check('slug', '400_8').isAlphanumeric();
        if (req.query.categoryId !== undefined) req.check('categoryId', '400_12').isInt();
        if (req.query.articleId !== undefined) req.check('articleId', '400_12').isInt();

        if (req.query.size === undefined) req.query.size = COMMON.defaultLoadingLength;
        if (req.query.last === undefined) req.query.last = 0;
        req.check('size', '400_5').isInt();
        req.check('last', '400_5').isInt();

        if (req.query.articleId !== undefined && req.query.categoryId === undefined) {
            res.hjson(req, next, 400, {
                code: '400_14'
            });
        }
        req.utils.common.checkError(req, res, next);
    };
};

get.loadBoard = function () {
    return function (req, res, next) {
        if (!req.user) req.user = {};
        req.models.Board.findBoardBySlug(
            req.user.role,
            req.query.slug,
            null,
            function (status, data) {
                if (status == 200) {
                    req.board = data;
                    if (data.categories && req.query.categoryId) {
                        var bSearched = false;
                        for (var i = 0; i < data.categories.length; ++i) {
                            if (data.categories[i].id == req.query.categoryId) {
                                bSearched = true;
                            }
                        }
                        if (req.query.categoryId !== undefined && bSearched == false) {
                            res.hjson(req, next, 404);
                        }
                    }
                    next();
                } else {
                    res.hjson(req, next, status, data);
                }
            }
        );
    };
};

get.loadArticles = function () {
    return function (req, res, next) {
        req.articles = [];
        req.article = {};
        if (req.query.articleId === undefined) {
            var categoryIds = [];
            var categories = req.board.categories;
            for (var i = 0; i < categories.length; ++i) {
                categoryIds.push(categories[i].id);
            }
            req.categoryIds = categoryIds;
            req.models.Article.findAllArticlesForPage(
                req.user.role,
                req.query.categoryId || req.categoryIds,
                req.query.nick,
                req.query.title,
                req.query.size,
                req.query.last,
                function (status, data) {
                    if (status == 200) {
                        req.articles = data;
                        next();
                    } else if (status == 404) {
                        next();
                    } else {
                        res.hjson(req, next, status, data);
                    }
                }
            );
        } else {
            req.models.Article.findArticleById(
                req.query.articleId,
                function (status, data) {
                    if (status == 200) {
                        if (!req.user) req.user = {};
                        if (data.category.id != req.query.categoryId ||
                            (data.category.isVisible == false && data.author.id != req.user.id)) {
                            return res.hjson(req, next, 404);
                        }
                        req.article = data;
                        next();
                    } else {
                        res.hjson(req, next, status, data);
                    }
                }
            );
        }
    };
};

get.loadNoticeArticles = function () {
    return function (req, res, next) {
        if (req.query.articleId === undefined) {
            req.models.Article.findAllNoticeArticlesForPage(
                req.user.role,
                req.query.categoryId || req.categoryIds,
                function (status, data) {
                    if (status == 200) {
                        req.noticeArticles = data;
                        next();
                    } else if (status == 404) {
                        req.noticeArticles = [];
                        next();
                    } else {
                        res.hjson(req, next, status, data);
                    }
                }
            );
        } else {
            next();
        }
    };
};

get.countArticles = function () {
    return function (req, res, next) {
        req.models.Article.countArticles(
            req.user.role,
            req.query.categoryId || req.categoryIds,
            false,
            req.query.nick,
            req.query.title,
            function (status, data) {
                req.articleCount = data || 0;
                next();
            }
        );
    };
};

get.countCommentsForEachArticles = function () {
    return function (req, res, next) {
        if (req.query.articleId === undefined) {
            var articleIds = [];
            var articleMap = {};
            for (var i = 0; i < req.articles.length; ++i) {
                articleIds.push(req.articles[i].id);
                articleMap[req.articles[i].id] = req.articles[i];
            }
            req.models.Comment.countCommentsForEachArticles(
                articleIds,
                function (status, data) {
                    if (status == 200 || status == 404) {
                        for (var i = 0; i < data.length; ++i) {
                            var article = articleMap[data[i].articleId];
                            article.dataValues.commentCount = data[i].count;
                        }
                    } else {
                        return res.hjson(req, next, status, data);
                    }
                    next();
                }
            );
        } else {
            next();
        }
    };
};

get.countComments = function () {
    return function (req, res, next) {
        req.commentCount = 0;
        if (req.query.articleId !== undefined) {
            req.models.Comment.countComments(req.query.articleId, function (status, data) {
                if (status == 200 || status == 404) {
                    req.commentCount = data;
                } else {
                    return res.hjson(req, next, status, data);
                }
                next();
            });
        } else {
            next();
        }
    };
};

get.loadComments = function () {
    return function (req, res, next) {
        req.comments = [];
        if (req.query.articleId !== undefined) {
            var COMMON = req.meta.std.common;
            req.models.Comment.findAllCommentsForBlog(
                req.article.id,
                null,
                COMMON.defaultLoadingLength,
                9999999999,
                function (status, data) {
                    if (status == 200 || status == 404) {
                        req.comments = data;
                        next();
                    } else {
                        return res.hjson(req, next, status, data);
                    }
                }
            );
        } else {
            next();
        }
    };
};

get.supplement = function () {
    return function (req, res, next) {

        var ret = {
            board: req.board,
            article: req.article,
            articles: req.articles,
            articleCount: req.articleCount,
            commentCount: req.commentCount,
            comments: req.comments,
            noticeArticles: req.noticeArticles
        };

        res.hjson(req, next, 200, ret);
    };
};

module.exports = get;
