var tester = require('../utils/response-tester');
var META = require('../../../bridge/metadata/index');
var STD = META.std;

module.exports = {
    "id": tester.type.NUMBER,
    "key": tester.type.STRING,
    "type": tester.type.ENUM + STD.notification.enumNotificationTypes,
    "title": tester.type.STRING,
    "body": tester.type.STRING,
    "data": tester.type.STRING,
    "img": tester.type.STRING,
    "isStored": tester.type.BOOLEAN,
    "isOption": tester.type.BOOLEAN,
    "description": tester.type.STRING
};
