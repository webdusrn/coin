var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

post.validate = function () {
    return function (req, res, next) {

        // if (req.refinedIP != '::ffff:' + req.config.authCi.allowedIp) {
        //     return res.hjson(req, next, 403);
        // }

        var USER = req.meta.std.user;

        if (req.body.type !== undefined) {
            req.check('type', '400_3').isEnum(USER.enumAuthType);
        }

        if (req.body.userId !== undefined) {
            req.check('userId', '400_12').isInt();
        }

        req.check('ci', '400_51').len(USER.minCiLength, USER.maxCiLength);
        if (req.body.di !== undefined) {
            req.check('di', '400_51').len(USER.minDiLength, USER.maxDiLength);
        }
        if (req.body.transactionNo !== undefined) {
            req.check('transactionNo', '400_51').len(USER.minTransactionLength, USER.maxTransactionLength);
        }

        if (req.body.name !== undefined) {
            req.check('name', '400_8').len(USER.minNameLength, USER.maxNameLength);
        }

        if (req.body.gender !== undefined) {
            req.check('gender', '400_3').isEnum(USER.enumGenders);
        }
        if (req.body.birthYear !== undefined && req.body.birthMonth !== undefined && req.body.birthDay !== undefined) {
            req.check('birthYear', '400_35').isYear();
            req.check('birthMonth', '400_36').isMonth();
            req.check('birthDay', '400_37').isDay();
            req.sanitize('birthYear').toInt();
            req.sanitize('birthMonth').toInt();
            req.sanitize('birthDay').toInt();
        }

        req.check('phoneNum', '400_7').len(5, 18);

        req.utils.common.checkError(req, res, next);
    };
};

post.setParams = function () {
    return function (req, res, next) {
        var USER = req.meta.std.user;

        var body = req.body;

        if (req.body.type == USER.authTypeSingUp) {

            req.models.AuthCi.upsertAuthCi(body, function (status, data) {
                if (status == 200) {
                    next();
                } else {
                    return res.hjson(req, next, status, data);
                }
            });

        } else if (req.body.type == USER.authTypeAddPhone || req.body.type == USER.authTypeChangePhone) {

            var birth = req.utils.common.makeBirthString(req.body.birthYear, req.body.birthMonth, req.body.birthDay);

            req.models.User.updateDataById(req.body.userId, {
                phoneNum: req.body.phoneNum,
                name: req.body.name,
                gender: req.body.gender,
                birth: birth,
                ci: req.body.ci,
                di: req.body.di
            }, function (status, data) {
                if (status == 204) {
                    next();
                } else {
                    return res.hjson(req, next, status, data);
                }
            });

        } else {
            return res.hjson(req, next, 400);
        }

    };
};

post.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 204);
    };
};

module.exports = post;
