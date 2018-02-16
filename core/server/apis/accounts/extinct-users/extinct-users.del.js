var del = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

del.destroy = function () {
    return function (req, res, next) {
        req.models.ExtinctUser.removeAllUsersInExpireDate(function (status, data) {
            if (status == 200 || status == 404) {
                next();
            } else {
                res.hjson(req, next, status, data);
            }
        })
    };
};

del.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 204);
    };
};

module.exports = del;
