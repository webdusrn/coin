var get = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

get.validate = function () {
    return function (req, res, next) {
        req.check('id', '400_12').isInt();
        req.utils.common.checkError(req, res, next);
    };
};

get.setParam = function () {
    return function (req, res, next) {
        if (req.user.role < req.meta.std.user.roleAdmin) {
            req.models.Report.findDataByAuthenticatedId(req.params.id, 'authorId', req.user.id, function (status, data) {
                if (status == 200) {
                    req.data = data;
                    next();
                } else {
                    res.hjson(req, next, status, data);
                }
            });
        } else {
            req.models.Report.findDataById(req.params.id, function (status, data) {
                if (status == 200) {
                    req.data = data;
                    next();
                } else {
                    res.hjson(req, next, status, data);
                }
            });
        }
    };
};

get.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.data);
    };
};

module.exports = get;
