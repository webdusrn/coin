var get = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

get.getUser = function () {
    return function (req, res, next) {
        if (!req.user) return res.hjson(req, next, 404);
        res.hjson(req, next, 200, req.user.toSecuredJSON());
    };
};

module.exports = get;
