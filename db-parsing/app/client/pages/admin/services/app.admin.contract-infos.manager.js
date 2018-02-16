export default function contractInfosManager (ContractInfo, ContractInfoAuthorization, ContractInfoUnauthorization, ContractInfoComplete, ContractInfoUncomplete, ContractInfoLastComplete) {
    'ngInject';

    this.findContractInfoById = findContractInfoById;
    this.findContractInfos = findContractInfos;
    this.authorization = authorization;
    this.unauthorization = unauthorization;
    this.complete = complete;
    this.uncomplete = uncomplete;
    this.findLastCompleteContractInfo = findLastCompleteContractInfo;

    function findLastCompleteContractInfo (data, callback) {
        var query = {
            userId: data.userId,
            category: data.category
        };
        ContractInfoLastComplete.get(query, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function uncomplete (data, callback) {
        var where= {id: data.id};
        var body = {};
        if (data.failMessage) body.failMessage = data.failMessage;
        ContractInfoUncomplete.update(where, body, function () {
            callback(204);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function complete (data, callback) {
        var where = {id: data.id};
        var body = {};
        ContractInfoComplete.update(where, body, function () {
            callback(204);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function authorization (data, callback) {
        var where = {id: data.id};
        var body = {
            startDate: data.startDate,
            sidos: data.sidos,
            sigungus: data.sigungus
        };
        ContractInfoAuthorization.update(where, body, function () {
            callback(204);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function unauthorization (data, callback) {
        var where = {id: data.id};
        var body = {};
        if (data.failMessage) body.failMessage = data.failMessage;
        ContractInfoUnauthorization.update(where, body, function () {
            callback(204);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function findContractInfos (query, callback) {
        ContractInfo.query(query, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function findContractInfoById (contractInfoId, callback) {
        ContractInfo.get({
            id: contractInfoId
        }, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }
}