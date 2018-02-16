var put = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

put.validate = function () {
    return function (req, res, next) {

        if (req.body.id !== undefined) req.check('id', '400_12').isInt();

        req.utils.common.checkError(req, res, next);
    };
};

put.updateNotificationBox = function () {
    return function (req, res, next) {
        var where = {
            userId: req.user.id
        };
        if (req.body.id !== undefined) {
            where.id = req.body.id;
        }

        req.models.NotificationBox.updateDataWithQuery({
            where: where
        }, {
            view: true
        }, function (status, data) {
            if (status == 200) {
                next();
            } else {
                res.hjson(req, next, status, data);
            }
        });
    };
};

put.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 204);
    };
};

module.exports = put;
