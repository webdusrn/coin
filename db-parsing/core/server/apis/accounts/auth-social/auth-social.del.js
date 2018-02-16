var del = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

del.validate = function () {
    return function (req, res, next) {
        const USER = req.meta.std.user;
        req.check('id', '400_12').isInt();
        req.check('provider', '400_3').isEnum(USER.enumProviders);

        req.utils.common.checkError(req, res, next);
    };
};

del.removeProvider = function () {
    return function (req, res, next) {
        var isSearched = false;
        var providers = req.loadedUser.providers;

        // 연동아이디가 하나뿐이면서, 아이디 비번 로그인, 폰번호 불가능할 경우
        if (!req.loadedUser.aid && !req.loadedUser.phoneNum && providers.length == 1) {
            return res.hjson(req, next, 400, {
                code: '400_50'
            });
        }

        var body = req.body;
        for (var i = 0; i < providers.length; ++i) {
            if (providers[i].type == body.provider) {
                isSearched = true;
                break;
            }
        }

        if (isSearched == false) {
            return res.hjson(req, next, 403);
        }
        
        var provider = providers[i];
        req.models.Provider.destroyData({
            id: provider.id
        }, false, function(status, data) {
            if (status == 204) {
                next();
            } else {
                res.hjson(req, next, status, data);
            }
        });
    };
};

del.supplement = function () {
    return function (req, res, next) {
        var providers = req.loadedUser.providers;
        for (var i = 0; i < providers.length; ++i) {
            if (providers[i].type == req.body.provider) {
                break;
            }
        }
        req.loadedUser.providers.splice(i, 1);
        res.hjson(req, next, 200, req.loadedUser);
    };
};

module.exports = del;
