export default function reqEstimationStatsManager (ReqEstimationStats) {
    'ngInject';

    this.getReqEstimationStats = getReqEstimationStats;

    function getReqEstimationStats (query, callback) {
        ReqEstimationStats.query(query, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }
}