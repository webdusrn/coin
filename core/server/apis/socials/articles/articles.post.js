var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

post.validate = function () {
    return function (req, res, next) {
        var ARTICLE = req.meta.std.article;

        req.check('slug', '400_8').isAlphanumeric();
        if (req.body.categoryId !== undefined) req.check('categoryId', '400_3').isInt();

        req.check('title', '400_8').len(ARTICLE.minTitleLength, ARTICLE.maxTitleLength);
        req.check('body', '400_8').len(ARTICLE.minBodyLength, ARTICLE.maxBodyLength);

        if (req.body.lat !== undefined) req.check('lat', '400_45').isFloat({min: -180, max: 180});
        if (req.body.lng !== undefined) req.check('lng', '400_45').isFloat({min: -180, max: 180});
        if (req.body.img !== undefined) req.check('img', '400_4').isImages(1);

        if (req.body.isNotice !== undefined) {
            req.check('isNotice', '400_20').isBoolean();
            req.sanitize('isNotice').toBoolean();
        }

        if (req.body.isVisible !== undefined) {
            req.check('isVisible', '400_20').isBoolean();
            req.sanitize('isVisible').toBoolean();
        }

        if (req.body.country !== undefined) {
            var enumCountry = req.coreUtils.common.getCountryEnum(req);
            req.check('country', '400_3').isEnum(enumCountry);
        } else {
            req.body.country = req.user.country;
        }

        // todo attack
        if (req.body.slug === undefined && req.body.categoryId !== undefined) {
            return res.hjson(req, next, 400);
        }

        req.utils.common.checkError(req, res, next);
    };
};

post.loadBoard = function () {
    return function (req, res, next) {
        req.models.Board.findBoardBySlug(
            req.user.role,
            req.body.slug,
            req.body.categoryId, function (status, data) {
                if (status == 200) {
                    req.board = data;
                    // 쓰기 권한 확인 or 공지사항을 쓸때 권한 확인
                    if ((data.roleWrite > req.user.role) ||
                        (req.body.isNotice == true && req.user.role < req.meta.std.user.roleAdmin)) {
                        return res.hjson(req, next, 401);
                    }
                    next();
                } else {
                    return res.hjson(req, next, status, data);
                }
            });
    };
};

post.createArticle = function () {
    return function (req, res, next) {

        var data = req.body;
        data.authorId = req.user.id;
        data.ip = req.refinedIP;

        var instance = req.models.Article.build(data);
        instance.create(function (status, data) {
            if (status == 200) {
                req.instance = data;
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

post.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 201, req.instance);
    };
};

module.exports = post;
