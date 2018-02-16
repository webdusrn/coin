export default function reqEstimationStatsTotal ($filter) {
    'ngInject';

    var number = $filter('number');

    return function (stats, key) {
        if (stats.rows.length) {
            if (key == 'estimationRate') {
                var requestCount = 0;
                var estimationCount = 0;
                stats.rows.forEach(function (item) {
                    requestCount += parseInt(item.requestCount);
                    estimationCount += parseInt(item.estimationCount);
                });
                return number(estimationCount / requestCount * 100, 1);
            } else if (key == 'matchRate') {
                var requestCount = 0;
                var matchCount = 0;
                stats.rows.forEach(function (item) {
                    requestCount += parseInt(item.requestCount);
                    matchCount += parseInt(item.matchCount);
                });
                return number(matchCount / requestCount * 100, 1);
            } else if (key == 'successRate') {
                var realMatchCount = 0;
                var matchCount = 0;
                stats.rows.forEach(function (item) {
                    realMatchCount += parseInt(item.realMatchCount);
                    matchCount += parseInt(item.matchCount);
                });
                return number(realMatchCount / matchCount * 100, 1);
            } else if (key == 'realSuccessRate') {
                var realMatchCount = 0;
                var requestCount = 0;
                stats.rows.forEach(function (item) {
                    realMatchCount += parseInt(item.realMatchCount);
                    requestCount += parseInt(item.requestCount);
                });
                return number(realMatchCount / requestCount * 100, 1);
            } else if (key == 'averageCash') {
                var totalCash = 0;
                var chargeCount = 0;
                stats.rows.forEach(function (item) {
                    totalCash += parseInt(item.totalCash);
                    chargeCount += parseInt(item.chargeCount);
                });
                return number(totalCash / chargeCount, 0);
            } else if (key == 'callRate') {
                var requestCount = 0;
                var callCount = 0;
                stats.rows.forEach(function (item) {
                    requestCount += parseInt(item.requestCount);
                    callCount += parseInt(item.callCount);
                });
                return number(callCount / requestCount * 100, 1);
            } else {
                var count = 0;
                stats.rows.forEach(function (item) {
                    count += parseInt(item[key]);
                });
                return number(count);
            }
        } else {
            return 0;
        }
    }
}