export default function premiumInfosManager (PremiumInfo, PremiumInfoAuthorization, PremiumInfoUnauthorization, PremiumInfoLastComplete) {
    'ngInject';

    this.findPremiumInfos = findPremiumInfos;
    this.findPremiumInfoById = findPremiumInfoById;
    this.unauthorization = unauthorization;
    this.authorization = authorization;
    this.findLastCompletePremiumInfo = findLastCompletePremiumInfo;

    function findLastCompletePremiumInfo (data, callback) {
        var query = {
            userId: data.userId,
            category: data.category
        };
        PremiumInfoLastComplete.get(query, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function authorization (data, callback) {
        var where = {id: data.id};
        var body = {
            startDate: data.startDate,
            expirationDay: data.expirationDay,
            sidos: data.sidos,
            sigungus: data.sigungus
        };
        PremiumInfoAuthorization.update(where, body, function () {
            callback(204);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function unauthorization (data, callback) {
        var where = {id: data.id};
        var body = {};
        if (data.failMessage) body.failMessage = data.failMessage;
        PremiumInfoUnauthorization.update(where, body, function () {
            callback(204);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function findPremiumInfoById (premiumInfoId, callback) {
        PremiumInfo.get({
            id: premiumInfoId
        }, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function findPremiumInfos (query, callback) {
        PremiumInfo.query(query, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }
}