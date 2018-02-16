var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var micro = require('microtime-nodejs');

post.validate = function () {
    return function (req, res, next) {
        var TERMS = req.meta.std.terms;
        req.check("type", "400_3").isEnum(TERMS.enumTypes);
        var enumLanguage = req.coreUtils.common.getLanguageEnum(req);
        req.check("language", "400_3").isEnum(enumLanguage);
        if (req.body.title !== undefined) req.check("title", "400_8").len(TERMS.minTitleLength, TERMS.maxTitleLength);
        if (req.body.content !== undefined) req.check("content", "400_8").len(TERMS.minContentLength, TERMS.maxContentLength);
        req.check("startDate", "400_18").isMicroTimestamp();
        req.utils.common.checkError(req, res, next);
    };
};

post.validateStartDate = function () {
    return function (req, res, next) {
        if(req.body.startDate > micro.now()){
            next();
        } else {
            res.hjson(req, next, 400, {
                code: '400_60'
            });
        }
    };
};

post.setParam = function () {
    return function (req, res, next) {
        var body = {
            authorId: req.user.id,
            type: req.body.type,
            language: req.body.language,
            startDate: req.body.startDate,
            title: req.body.title,
            content: req.body.content
        };

        req.models.Terms.createTerms(body, function (status, data) {
            if (status == 200) {
                req.data = data;
                next();
            } else {
                res.hjson(req, next, status, data);
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
