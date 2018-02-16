var put = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var MICRO = require('microtime-nodejs');

put.updateAndGetUser = function () {
    return function (req, res, next) {
        var current = MICRO.now();
        req.user.updateFields({
            updatedAt: current
        }, function(status, data) {
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
        res.hjson(req, next, 200, req.user.toSecuredJSON());
    };
};

module.exports = put;
