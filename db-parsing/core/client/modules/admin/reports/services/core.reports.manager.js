export default function reportsManager($filter, Report, metaManager, dialogHandler) {
    "ngInject";

    var MAGIC = metaManager.std.magic;
    var COMMON = metaManager.std.common;

    this.findReportById = findReportById;
    this.updateReportById = updateReportById;
    this.findReports = findReports;
    this.deleteReport = deleteReport;
    this.createReport = createReport;

    function updateReportById(id, report, callback) {

        if (isFormValidate(report)) {
            var where = {id: id};
            if (!report.reply) report.reply = MAGIC.reset;
            Report.update(where, report, function (data) {
                callback(200, data);
            }, function (data) {
                callback(data.status, data.data);
            });
        } else {
            callback(400, {
                code: "400_53"
            });
        }

    }

    function findReportById(reportId, callback) {
        Report.get({
            id: reportId
        }, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function findReports(data, callback) {
        var query = {};
        if (data.searchItem !== undefined) query.searchItem = data.searchItem;
        if (data.searchField !== undefined) query.searchField = data.searchField;
        if (data.last !== undefined) query.last = data.last;
        if (data.size !== undefined) query.size = data.size;
        if (data.authorId !== undefined) query.authorId = data.authorId;
        if (data.isSolved !== undefined && data.isSolved != COMMON.all) query.isSolved = data.isSolved;
        if (data.sort !== undefined) query.sort = data.sort;
        Report.query(query, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function deleteReport(report, callback) {
        report = new Report(report);
        report.$remove(function (data) {
            callback(204);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function createReport(body, callback) {
        var report = new Report(body);
        report.$save(function (data) {
            callback(201, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function isFormValidate(form) {

        var isValidate = true;

        if (form.reply === undefined || form.reply === null || form.reply === '') {
            isValidate = false;
            dialogHandler.show('', $filter('translate')('requireBody'), '', true);
            return isValidate;
        }

        return isValidate;
    }
}