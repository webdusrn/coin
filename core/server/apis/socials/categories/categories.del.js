var del = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

del.validate = function () {
    return function (req, res, next) {
        req.check('id', '400_12').isInt();
        req.utils.common.checkError(req, res, next);
    };
};

del.checkBoard = function () {
    return function (req, res, next) {
        // todo performance
        req.models.Category.findDataById(req.params.id, function (status, data) {
            if (status == 200) {
                req.category = data;
                req.models.Category.countData({boardId: data.boardId}, function (status, count) {
                    if (status == 200) {
                        if (count <= 1) {
                            return res.hjson(req, next, 400, {
                                code: '400_48'
                            });
                        }
                        next();
                    } else {
                        res.hjson(req, next, status, data);
                    }
                });
            } else {
                res.hjson(req, next, status, data);
            }
        });
    };
};

del.destroy = function () {
    return function (req, res, next) {
        req.models.Category.destroyDataById(req.params.id, true, function (status, data) {
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
