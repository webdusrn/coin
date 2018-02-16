var STD = require('../../../bridge/metadata/standards');

module.exports = function () {

    function Role() {
    }

    Role.prototype.userIdChecker = function(body, key, role) {
        return function(req, res, next) {
            if (req.user && req[body][key] != req.user.id && role > req.user.role) {
                res.hjson(req, next, 403);
            } else {
                req.loadedUser = null;
                if (req.user && req[body][key] == req.user.id) {
                    req.loadedUser = req.user;
                    next();
                } else {
                    req.models.User.findUserById(req[body][key], function(status, data){
                        if (status == 200) {
                            req.loadedUser = data;
                            next();
                        } else {
                            res.hjson(req, next, status, data);
                        }
                    });
                }
            }
        }
    };

    return new Role();
};