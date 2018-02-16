export default function reportsManager (Report) {
    "ngInject";

    this.findReportById = findReportById;
    this.updateReportById = updateReportById;
    this.findReports = findReports;
    this.deleteReport = deleteReport;
    this.createReport = createReport;

    function updateReportById (report, callback) {
        var where = {id: report.id};
        delete report.id;
        Report.update(where, report, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function findReportById (reportId, callback) {
        Report.get({
            id: reportId
        }, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function findReports (data, callback) {
        var query = {};
        if (data.searchItem !== undefined) query.searchItem = data.searchItem;
        if (data.searchField !== undefined) query.searchField = data.searchField;
        if (data.last !== undefined) query.last = data.last;
        if (data.size !== undefined) query.size = data.size;
        if (data.authorId !== undefined) query.authorId = data.authorId;
        if (data.isSolved !== undefined) query.isSolved = data.isSolved;
        if (data.sort !== undefined) query.sort = data.sort;
        Report.query(query, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function deleteReport (report, callback) {
        report = new Report(report);
        report.$remove(function (data) {
            callback(204);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function createReport (body, callback) {
        var report = new Report(body);
        report.$save(function (data) {
            callback(201, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }
}