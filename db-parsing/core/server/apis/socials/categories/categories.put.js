var put = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

put.validate = function () {
    return function (req, res, next) {
        var CATEGORY = req.meta.std.category;

        req.check('id', '400_12').isInt();
        if (req.body.name !== undefined) {
            req.check('name', '400_8').len(CATEGORY.minNameLength, CATEGORY.maxNameLength);
        }

        if (req.body.isVisible !== undefined) {
            req.check('isVisible', '400_20').isBoolean();
            req.sanitize('isVisible').toBoolean();
        }

        if (req.body.name === undefined && req.body.isVisible === undefined) {
            return res.hjson(req, next, 400, {
                code: '400_14'
            });
        }

        // todo category names
        req.utils.common.checkError(req, res, next);
    };
};

put.update = function () {
    return function (req, res, next) {
        req.models.Category.updateDataById(req.params.id, req.body, function (status, data) {
            if (status == 200) {
                req.data = data;
                next();
            } else {
                res.hjson(req, next, status, data);
            }
        });
    };
};

put.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.data);
    };
};

module.exports = put;
