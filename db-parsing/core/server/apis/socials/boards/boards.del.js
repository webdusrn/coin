var del = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

del.validate = function () {
    return function (req, res, next) {
        req.check('slug', '400_8').isAlphanumeric();
        req.utils.common.checkError(req, res, next);
    };
};

del.destroyBoard = function () {
    return function (req, res, next) {
        req.models.Board.destroyDataBySlug(req.params.slug, function(status, data) {
            if (status == 200) {
                next();
            } else {
                res.hjson(req, next, status, data);
            }
        });
    };
};

del.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 204);
    };
};

module.exports = del;
