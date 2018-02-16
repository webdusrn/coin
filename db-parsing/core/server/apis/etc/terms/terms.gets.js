var gets = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var MICRO = require('microtime-nodejs');
gets.validate = function () {
    return function (req, res, next) {
        var COMMON = req.meta.std.common;
        var TERMS = req.meta.std.terms;

        if (req.query.appliedId !== undefined) req.check("appliedId", "400_12").isInt();
        if (req.query.title !== undefined) req.check("title", "400_8").len(TERMS.minTitleLength, TERMS.maxTitleLength);

        if (req.query.sort === undefined) req.query.sort = COMMON.DESC;
        if (req.query.type !== undefined) req.check("type", "400_3").isEnum(TERMS.enumTypes);
        if (req.query.language !== undefined) {
            var enumLanguages = req.coreUtils.common.getLanguageEnum(req);
            req.check("language", "").isEnum(enumLanguages);
        }

        req.utils.common.checkError(req, res, next);
    };
};

gets.checkExistTerms = function () {
    return function (req, res, next) {
        req.models.Terms.findDataWithQuery({}, function (status, data) {
            if (status == 200) {
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

gets.setParam = function () {
    return function (req, res, next) {


        //아이디가 있을 때
        if (req.query.appliedId !== undefined) {

            req.models.Terms.findTermsById(req.query.appliedId, function (status, data) {
                if (status == 200) {
                    req.data = data;
                    next();
                } else {
                    return res.hjson(req, next, status, data);
                }
            });

            //아이디가 없고 타이틀이 있을 때
        } else if (req.query.title !== undefined) {

            req.models.Terms.findTermsWithTitle(req.query.title, function (status, data) {
                if (status == 200) {
                    req.data = data;
                    next();
                } else {
                    return res.hjson(req, next, status, data);
                }
            });

            //아무것도 아닐 때 (처음 로딩)
        } else {

            var options = {
                sort: req.query.sort,
                language: req.query.language
            };

            req.models.Terms.findTermsByOptions(options, function (status, data) {
                if (status == 200) {
                    req.data = data;
                    next();
                } else {
                    return res.hjson(req, next, status, data);
                }
            });

        }

    };
};

gets.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.data);
    };
};

module.exports = gets;
