var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

post.validate = function () {
    return function (req, res, next) {
        var REPORT = req.meta.std.report;
        req.check('body', '400_8').len(REPORT.minBodyLength, REPORT.maxBodyLength);
        if (req.body.nick !== undefined) {
            req.check('nick', '400_8').len(REPORT.minNickLength, REPORT.maxNickLength)
        }
        if (req.body.email !== undefined) {
            req.check('email', '400_1').isEmail();
        }
        
        req.utils.common.checkError(req, res, next);
    };
};

post.setParam = function () {
    return function (req, res, next) {
        var body = {
            body: req.body.body
        };
        if (req.body.nick !== undefined) {
            body.nick = req.body.nick;
        }
        if (req.body.email !== undefined) {
            body.email = req.body.email;
        }
        if (req.isAuthenticated()) {
            body.authorId = req.user.id;
        }
        
        var instance = req.models.Report.build(body);
        instance.create(function(status, data) {
            if (status == 200) {
                req.instance = data;
                next();
            } else {
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
