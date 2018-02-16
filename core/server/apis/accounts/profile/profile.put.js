var put = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

put.validate = function () {
    return function (req, res, next) {
        var PROFILE = req.meta.std.profile;
        var MAGIC = req.meta.std.magic;

        req.check('userId', '400_12').isInt();

        for (var i=0; i<PROFILE.includeProfileItems.length; i++) {
            var temp = PROFILE.includeProfileItems[i].type;
            if (req.body.contents[temp] !== undefined && req.body.contents[temp] !== MAGIC.reset){
                if (req.body.contents[temp].length < PROFILE.includeProfileItems[i].minLength || req.body.contents[temp].length > PROFILE.includeProfileItems[i].maxLength) {
                    return res.hjson(req, next, 400, {
                        code: '400_8'
                    });
                }
            }
        }
        next();
    };
};

put.updateProfile = function () {
    return function (req, res, next) {
        var MAGIC = req.meta.std.magic;
        var update = {};

        if (req.body.userId !== undefined) update.id = req.body.userId;
        for (var k in req.body.contents) {
            if (req.body.contents[k] !== undefined) {
                update[k] = req.body.contents[k];
                if (update[k] == MAGIC.reset) update[k] = "";
            }
        }

        req.models.Profile.updateProfile(update, function (status, data) {
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
