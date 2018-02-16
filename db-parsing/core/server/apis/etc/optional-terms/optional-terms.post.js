var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

post.validate = function () {
    return function (req, res, next) {

        var TERMS = req.meta.std.terms;

        req.check('termsIds', '400_12').isNumberIds(TERMS.maxOptionalTermsCount);

        req.utils.common.checkError(req, res, next);
    };
};

post.setParam = function () {
    return function (req, res, next) {

        req.models.OptionalTerms.createOptionalTerms(req.user.id, req.body.termsIds, function (status, data) {
            if (status == 201) {
                req.data = data;
                next();
            } else {
                return res.hjson(req, next, status, data);
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
