var STD = require('../../../bridge/metadata/standards');
var errorHandler = require('sg-sequelize-error-handler');

module.exports = function () {

    function Terms() {
    }

    Terms.prototype.isAgreedTerms = function () {
        return function (req, res, next) {

            var TERMS = req.meta.std.terms;

            if (req.user.agreedTermsAt) {

                req.models.Terms.findAll({
                    where: {
                        type: TERMS.enumTypes.typeEssential
                    },
                    order: [['startDate', 'DESC']],
                    limit: 1
                }).then(function (terms) {
                    if (terms) {

                        if (req.user.agreedTermsAt >= terms[0].dataValues.createdAt) {
                            next();
                        } else {
                            res.hjson(req, next, 403, {
                                code: "403_20"
                            });
                        }

                    } else {
                        next();
                    }
                });

            } else {
                res.hjson(req, next, 403, {
                    code: "403_20"
                });
            }

        }
    };

    return new Terms();
};