var get = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

get.validate = function () {
    return function (req, res, next) {
        req.check('id', '400_12').isInt();
        req.utils.common.checkError(req, res, next);
    };
};

get.getUser = function () {
    return function (req, res, next) {

        req.models.User.findUserById(req.params.id, function(status, data) {
            if (status == 200) {
                req.loadedUser = data;
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

get.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.loadedUser.toSecuredJSON());
    };
};

module.exports = get;
