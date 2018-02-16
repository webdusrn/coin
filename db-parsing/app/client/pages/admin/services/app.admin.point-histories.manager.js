export default function pointHistoriesManager (PointHistory) {
    'ngInject';

    this.findPointHistories = findPointHistories;
    this.createPointHistory = createPointHistory;

    function findPointHistories (query, callback) {
        PointHistory.query(query, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function createPointHistory (data, callback) {
        var body = {
            userId: data.userId,
            type: data.type,
            sgCash: data.sgCash,
            sgDeposit: data.sgDeposit
        };
        var pointHistory = new PointHistory(body);
        pointHistory.$save(function (data) {
            callback(201, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }
}