export default function dashboardInfoManager(DashboardInfo) {
    "ngInject";

    this.findDashboardInfo = findDashboardInfo;

    function findDashboardInfo(data, callback) {

        var date = new Date();

        var query = {
            timeZoneOffset: data.timeZoneOffset || date.getTimezoneOffset(),
            year: data.year || date.getFullYear(),
            month: data.month || date.getMonth() + 1,
            day: data.year || date.getDate()
        };

        DashboardInfo.get(query, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }


}