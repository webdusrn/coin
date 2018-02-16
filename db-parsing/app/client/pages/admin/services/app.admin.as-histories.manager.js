export default function asHistoriesManager (AsHistory) {
    'ngInject';

    this.findAsHistories = findAsHistories;
    this.findAsHistoryById = findAsHistoryById;
    this.updateAsHistory = updateAsHistory;

    function findAsHistoryById (asHistoryId, callback) {
        AsHistory.get({
            id: asHistoryId
        }, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        })
    }

    function findAsHistories (query, callback) {
        AsHistory.query(query, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function updateAsHistory (data, callback) {
        var where = {id: data.id};
        var body = {};
        if (data.asState !== undefined) body.asState = data.asState;
        if (data.asCallState !== undefined) body.asCallState = data.asCallState;
        if (data.engineerId !== undefined) body.engineerId = data.engineerId;
        if (data.visitDate !== undefined) body.visitDate = data.visitDate;
        AsHistory.update(where, body, function () {
            callback(204);
        }, function (data) {
            callback(data.status, data.data);
        });
    }
}