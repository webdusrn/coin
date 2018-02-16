var top = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

top.hasAuthorization = function () {
    return function (req, res, next) {
        req.models.OptionalTerms.findDataByAuthenticatedId(req.params.id, 'userId', req.user.id, function (status, data) {
            if (status == 200) {
                next();
            } else {
                res.hjson(req, next, status, data);
            }
        });
    };
};

module.exports = top;
