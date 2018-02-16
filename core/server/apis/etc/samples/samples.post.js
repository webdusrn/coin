var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

post.validate = function () {
    return function (req, res, next) {
        var REPORT = req.meta.std.report;
        req.check('body', '400_8').len(REPORT.minBodyLength, REPORT.maxBodyLength);
        req.utils.common.checkError(req, res, next);
    };
};

post.setParam = function () {
    return function (req, res, next) {
        var instance = req.models.Test.build({
            userId: req.user.id,
            body: req.body.body
        });
        instance.create(function(status, data) {
            if (status == 200) {
                req.instance = data;
                next();
            } else {
                req.utils.common.refineError(data, 'name', '400_1');
                return res.hjson(req, next, status, data);
            }
        });
    };
};

post.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.instance);
    };
};

module.exports = post;
