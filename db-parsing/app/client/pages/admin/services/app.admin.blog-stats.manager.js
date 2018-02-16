export default function blogStatsManager (BlogStats) {
    'ngInject';

    this.getBlogStats = getBlogStats;

    function getBlogStats (query, callback) {
        BlogStats.query(query, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }
}