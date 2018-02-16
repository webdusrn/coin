var get = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

get.validate = function () {
    return function (req, res, next) {
        req.check('key', '400_3').isEnum(['email', 'phoneNum', 'nick', 'aid']);
        req.query.value = decodeURIComponent(req.query.value);
        req.utils.common.checkError(req, res, next);
    };
};

get.checkUnique = function () {
    return function (req, res, next) {

        var query = {
            where: {}
        };

        query.where[req.query.key] = req.query.value;
        req.models.User.findOne(query).then(function (user) {
            if (user) {

                var key = req.query.key;
                var code;
                if (key == 'email') {
                    code = '409_5';
                } else if (key == 'phoneNum') {
                    code = '409_1';
                } else if (key == 'nick') {
                    code = '409_3';
                } else if (key == 'aid') {
                    code = '409_2';
                }

                return res.hjson(req, next, 409, {
                    code: code
                });
            }
            return res.hjson(req, next, 204);
        }).catch(function (err) {
            return res.hjson(req, next, 500, err);
        });
    };
};

module.exports = get;
