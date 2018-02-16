var tester = require('../utils/response-tester');
var META = require('../../../bridge/metadata/index');
var STD = META.std;

module.exports = {
    "id": tester.type.STRING,
    "title": tester.type.STRING,
    "body": tester.type.STRING,
    "country": tester.type.ENUM + STD.notice.enumCountries,
    "type": tester.type.ENUM + STD.notice.enumNoticeTypes,
    "startDate": tester.type.NUMBER_ALLOW_NULL,
    "endDate": tester.type.NUMBER_ALLOW_NULL,
    "thumbnailImageId": tester.type.NUMBER_ALLOW_NULL,
    "bigImageId": tester.type.NUMBER_ALLOW_NULL,
    "smallImageId": tester.type.NUMBER_ALLOW_NULL,
    "createdAt": tester.type.NUMBER,
    "updatedAt": tester.type.NUMBER,
    "deletedAt": tester.type.DATE_ALLOW_NULL
};
