var put = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

put.validate = function () {
    return function (req, res, next) {
        req.check('token', '400_2').len(1, 2000);

        req.utils.common.checkError(req, res, next);
    };
};


put.updateToken = function () {
    return function (req, res, next) {
        req.models.LoginHistory.updateLoginHistoryTokenBySession(req.sessionID, req.body.token, function (status, data) {
            if (status == 204) {
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
