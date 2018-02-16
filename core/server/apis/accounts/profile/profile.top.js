var top = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

top.hasAuthorization = function() {
    return function (req, res, next) {
        var userId = req.body.userId;
        if (req.user.role >= req.meta.std.user.roleAdmin) {
            return next();
        }
        req.models.User.findDataByAuthenticatedId(userId, 'id', userId, function(status, data) {
            if (status == 200) {
                req.data = data;
                next();
            } else {
                res.hjson(req, next, status, data);
            }
        });
    };
};

module.exports = top;
