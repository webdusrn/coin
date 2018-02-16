var put = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

put.validate = function () {
    return function (req, res, next) {

        const USER = req.meta.std.user;
        const MAGIC = req.meta.std.magic;
        var isEmpty = true;
        var isBirthParam = false;

        req.check('id', '400_17').isInt();
        if (req.body.aid !== undefined) {
            isEmpty = true;
            req.check("aid", "400_8").len(USER.minAidLength, USER.maxAidLength);
        }
        if (req.body.nick !== undefined && req.body.nick !== MAGIC.reset) {
            isEmpty = true;
            req.check('nick', '400_26').len(USER.minNickLength, USER.maxNickLength);
        }
        if (req.body.phoneNum !== undefined && req.body.phoneNum !== MAGIC.reset) {
            isEmpty = true;
            req.check('phoneNum', '400_7').len(5, 18);
        }
        if (req.body.gender !== undefined && req.body.gender !== MAGIC.reset) {
            isEmpty = true;
            req.check('gender', '400_3').isEnum(USER.enumGenders);
        }
        if (req.body.birthYear !== undefined && req.body.birthYear !== MAGIC.reset) {
            isEmpty = true;
            isBirthParam = true;
            req.check('birthYear', '400_35').isYear();
        }
        if (req.body.birthMonth !== undefined && req.body.birthMonth !== MAGIC.reset) {
            isEmpty = true;
            isBirthParam = true;
            req.check('birthMonth', '400_36').isMonth();
        }
        if (req.body.birthDay !== undefined && req.body.birthDay !== MAGIC.reset) {
            isEmpty = true;
            isBirthParam = true;
            req.check('birthDay', '400_37').isDay();
        }
        if (req.body.pfImgId !== undefined && req.body.pfImgId !== MAGIC.reset) {
            isEmpty = true;
            req.check('pfImgId', '400_12').isInt();
        }
        if (req.body.bgImgId !== undefined && req.body.bgImgId !== MAGIC.reset) {
            isEmpty = true;
            req.check('bgImgId', '400_12').isInt();
        }
        if (req.body.comment !== undefined && req.body.comment !== MAGIC.reset) {
            isEmpty = true;
            req.check('comment', '400_8').len(USER.minCommentLength, USER.maxCommentLength);
        }
        if (req.body.website !== undefined && req.body.website !== MAGIC.reset) {
            isEmpty = true;
            req.check('website', '400_52').isURL();
        }
        if (req.body.country !== undefined) {
            isEmpty = true;
            var enumCountry = req.coreUtils.common.getCountryEnum(req);
            req.check('country', '400_3').isEnum(enumCountry);
        }
        if (req.body.language !== undefined) {
            isEmpty = true;
            var enumLanguage = req.coreUtils.common.getLanguageEnum(req);
            req.check('language', '400_3').isEnum(enumLanguage);
        }
        if (req.body.isPublic !== undefined) {
            isEmpty = true;
            req.check('isPublic', '400_5').isBoolean();
            req.sanitize('isPublic').toBoolean();
        }
        if (req.body.agreedEmail !== undefined) {
            req.check('agreedEmail', '400_20').isBoolean();
            req.sanitize('agreedEmail').toBoolean();
        }
        if (req.body.agreedPhoneNum !== undefined) {
            req.check('agreedPhoneNum', '400_20').isBoolean();
            req.sanitize('agreedPhoneNum').toBoolean();
        }
        if (req.body.isReviewed !== undefined) {
            req.check('isReviewed', '400_20').isBoolean();
            req.sanitize('isReviewed').toBoolean();
        }
        if (req.body.name !== undefined && req.body.name !== MAGIC.name) {
            isEmpty = true;
            req.check('name', '400_8').len(USER.minNameLength, USER.maxNameLength);
        }
        if (req.body.phoneNum !== undefined && req.body.phoneNum !== MAGIC.reset) {
            isEmpty = true;
            req.check('phoneNum', '400_8').len(USER.minPhoneNumLength, USER.maxPhoneNumLength);
        }

        // 생년월일을 모두 입력하지 않았을 경우.
        if (isBirthParam == true &&
            (req.body.birthYear === undefined
            || req.body.birthMonth === undefined
            || req.body.birthDay === undefined)) {
            return res.hjson(req, next, 400, {
                code: '400_34'
            });
        }

        if (req.body.role !== undefined) {
            if (req.user.role < USER.roleSuperAdmin) {
                return res.hjson(req, next, 401);
            }
            isEmpty = true;
            req.check('role', '400_3').isEnum(USER.enumRoles);
        }

        if (isEmpty == false) {
            return res.hjson(req, next, 400, {
                code: '400_19'
            });
        }

        req.utils.common.checkError(req, res, next);
    };
};

put.dataSet = function () {
    return function (req, res, next) {
        const MAGIC = req.meta.std.magic;
        var update = {};
        if (req.body.gender !== undefined) update.gender = req.body.gender;
        if (req.body.pfImgId !== undefined) update.pfImgId = req.body.pfImgId;
        if (req.body.bgImgId !== undefined) update.bgImgId = req.body.bgImgId;
        if (req.body.birthYear !== undefined && req.body.birthMonth !== undefined && req.body.birthDay !== undefined) {
            if (req.body.birthYear === MAGIC.reset) {
                update.birth = null;
            } else {
                update.birth = req.utils.common.makeBirthString(req.body.birthYear, req.body.birthMonth, req.body.birthDay);
            }
        }
        if (req.body.country !== undefined) update.country = req.body.country;
        if (req.body.language !== undefined) update.language = req.body.language;
        if (req.body.isPublic !== undefined) update.isPublic = req.body.isPublic;
        if (req.body.comment !== undefined) update.comment = req.body.comment;
        if (req.body.website !== undefined) update.website = req.body.website;
        if (req.body.role !== undefined) update.role = req.body.role;
        if (req.body.agreedEmail !== undefined) update.agreedEmail = req.body.agreedEmail;
        if (req.body.agreedPhoneNum !== undefined) update.agreedPhoneNum = req.body.agreedPhoneNum;
        if (req.body.isReviewed !== undefined) update.isReviewed = req.body.isReviewed;
        if (req.body.name !== undefined) update.name = req.body.name;
        if (req.body.phoneNum !== undefined) update.phoneNum = req.body.phoneNum;
        if (req.body.nick !== undefined) update.nick = req.body.nick;
        if (req.body.aid !== undefined) update.aid = req.body.aid;

        for (var k in update) {
            if (update[k] == MAGIC.reset) {
                update[k] = "";
            }
        }

        req.update = update;
        next();
    };
};

put.updateUser = function () {
    return function (req, res, next) {
        req.models.User.updateDataByIdAndReturnData(req.params.id, req.update, function (status, body) {
            if (status == 204) {
                req.data = data;
                next();
            } else if (status == 500) {
                logger.e(body);
                return res.hjson(req, next, status, body);
            } else {
                return res.hjson(req, next, status, body);
            }
        });
    };
};

put.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.data);
    };
};

module.exports = put;
