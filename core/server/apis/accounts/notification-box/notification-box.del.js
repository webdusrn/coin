var del = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

del.validate = function () {
    return function (req, res, next) {
        req.check('id', '400_12').isInt();
        if (req.query.userId !== undefined) req.check('userId', '400_12').isInt();
        if (req.body.userId !== undefined) req.check('userId', '400_12').isInt();
        req.utils.common.checkError(req, res, next);
    };
};

del.destroy = function () {
    return function (req, res, next) {

        req.models.NotificationBox.destroyDataById(req.params.id, false, function (status, data) {
            if (status == 204) {
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
