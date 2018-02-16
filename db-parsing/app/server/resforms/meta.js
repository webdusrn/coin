var tester = require('../../../core/server/utils/response-tester');
var META = require('../../../bridge/metadata/index');
var STD = META.std;

module.exports = {
    "reOfferPossibleDay": tester.type.NUMBER,
    "reqEstimationPossibleHour": tester.type.NUMBER,
    "maxCreateEstimationNumSameTime": tester.type.NUMBER,
    "reqEstimationProcessHour": tester.type.NUMBER,
    "bookInstallTodayPushHour": tester.type.NUMBER,
    "anotherEstimationCallHour": tester.type.NUMBER,
    "asHistoryExpirationDay": tester.type.NUMBER,
    "ready": tester.type.BOOLEAN,
    "freeMatchCount": tester.type.NUMBER,
    "maxMatchCount": tester.type.NUMBER,
    "pointTypeAirConditioner": tester.type.STRING,
    "pointTypeAirConditionerClean": tester.type.STRING,
    "pointTypeWallTv": tester.type.STRING,
    "pointTypeDoorLock": tester.type.STRING,
    "pointTypeWindowScreen": tester.type.STRING,
    "pointTypeBoiler": tester.type.STRING,
    "pointDiscountRateAirConditioner": tester.type.NUMBER,
    "pointDiscountRateAirConditionerClean": tester.type.NUMBER,
    "pointDiscountRateWallTv": tester.type.NUMBER,
    "pointDiscountRateDoorLock": tester.type.NUMBER,
    "pointDiscountRateWindowScreen": tester.type.NUMBER,
    "pointDiscountRateBoiler": tester.type.NUMBER,
    "maxSgDeposit": tester.type.NUMBER,
    "createdAt": tester.type.NUMBER,
    "updatedAt": tester.type.NUMBER,
    "deletedAt": tester.type.DATE_ALLOW_NULL,
    "id": tester.type.NUMBER
};
