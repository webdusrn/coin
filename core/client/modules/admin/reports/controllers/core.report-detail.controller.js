export default function ReportDetailCtrl($scope, $uibModalInstance, scope, report) {
    "ngInject";

    var LOADING = scope.metaManager.std.loading;
    var REPORT = scope.metaManager.std.report;

    $scope.currentReport = report;

    $scope.form = {
        reply: report.reply,
        isSolved: true,
        isPushOn: false,
        isEmailOn: false,
        isMessageOn: false
    };

    $scope.enablePush = false;

    if (report.author != null) {
        var loginHistories = report.author.loginHistories;

        for (var i = 0; i < loginHistories.length; i++) {
            if (loginHistories[i].token) {
                $scope.enablePush = true;
            }
        }
    }

    $scope.solveReport = solveReport;
    $scope.cancel = cancel;

    function solveReport() {

        var body = angular.copy($scope.form);

        scope.loadingHandler.startLoading(LOADING.spinnerKey, 'updateReportById');
        scope.reportsManager.updateReportById($scope.currentReport.id, body, function (status, data) {
            if (status == 200) {

                if (scope.isSolved == REPORT.unsolved) {
                    scope.reportList.splice(scope.currentIndex, 1);
                } else {
                    scope.reportList[scope.currentIndex].reply = data.reply;
                    scope.reportList[scope.currentIndex].solvedAt = data.solvedAt;
                }

                $uibModalInstance.close(data);
            } else {
                scope.dialogHandler.alertError(status, data);
            }
            scope.loadingHandler.endLoading(LOADING.spinnerKey, 'updateReportById');
        });

    }

    function cancel() {
        $uibModalInstance.dismiss('cancel');
    }
}