var tester = require('../utils/response-tester');
var META = require('../../../bridge/metadata/index');
var STD = META.std;

module.exports = {
    "aid": tester.type.STRING_ALLOW_NULL,
    "email": tester.type.STRING_ALLOW_NULL,
    "phoneNum": tester.type.STRING_ALLOW_NULL,
    "name": tester.type.STRING_ALLOW_NULL,
    "nick": tester.type.STRING_ALLOW_NULL,
    "role": tester.type.ENUM + STD.user.enumRoles,
    "gender": tester.type.ENUM_ALLOW_NULL + STD.user.enumGenders,
    "birth": tester.type.DATE_ALLOW_NULL,
    "isVerifiedEmail": tester.type.BOOLEAN,
    "country": tester.type.STRING,
    "language": tester.type.STRING,
    "isReviewed": tester.type.BOOLEAN,
    "agreedEmail": tester.type.BOOLEAN,
    "agreedPhoneNum": tester.type.BOOLEAN,
    "profileId": tester.type.NUMBER_ALLOW_NULL,
    "createdAt": tester.type.NUMBER,
    "updatedAt": tester.type.NUMBER,
    "deletedAt": tester.type.DATE_ALLOW_NULL,
    "id": tester.type.STRING,
    "profile": {},
    "providers": [{
        "id": tester.type.NUMBER,
        "type": tester.type.ENUM + STD.user.enumProviders,
        "uid": tester.type.NUMBER
    }],
    "loginHistories": [{
        "id": tester.type.NUMBER,
        "platform": tester.type.STRING_ALLOW_NULL,
        "device": tester.type.STRING_ALLOW_NULL,
        "version": tester.type.STRING_ALLOW_NULL,
        "token": tester.type.STRING_ALLOW_NULL
    }]
};
