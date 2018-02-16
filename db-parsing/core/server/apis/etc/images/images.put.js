var put = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

put.validate = function () {
    return function (req, res, next) {
        req.check('authorized', '400_20').isBoolean();
        req.utils.common.checkError(req, res, next);
    };
};

put.updateImage = function () {
    return function (req, res, next) {
        var update = {
            authorized: req.body.authorized
        };
        req.models.Image.updateDataByIdAndReturnData(req.params.id, update, function (status, data) {
            if (status == 200) {
                req.image = data;
                next();
            } else {
                res.hjson(req, next, status, data);
            }
        });
    };
};

put.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.image);
    };
};

module.exports = put;
