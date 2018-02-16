export default function ReportDetailCtrl($scope, $filter, $uibModalInstance, scope, notice, isEditMode) {
    "ngInject";

    var NOTICE = scope.metaManager.std.notice;
    var COMMON = scope.metaManager.std.common;
    var LOADING = scope.metaManager.std.loading;

    $scope.currentNotice = notice;

    $scope.form = {
        title: notice.title,
        body: notice.body,
        type: notice.type,
        country: notice.country
    };

    $scope.form.startDate = setTimestampToString(notice.startDate);
    $scope.form.endDate = setTimestampToString(notice.endDate);

    $scope.noticeTypes = NOTICE.enumNoticeTypes;
    $scope.noticeCountries = scope.noticeCountries;

    $scope.startEditMode = startEditMode;
    $scope.exitEditMode = exitEditMode;
    $scope.updateNotice = updateNotice;
    $scope.cancel = cancel;

    if (isEditMode) {
        startEditMode();
    }

    function startEditMode() {
        $scope.isNoticeEditMode = true;
    }

    function exitEditMode() {
        $scope.isNoticeEditMode = false;
    }

    function setTimestampToString(date){
        if(date == null || date == ''){
            return null;
        }
        var t = new Date( date/1000 );
        var formatted = t.toISOString().substring(0, 10);
        return formatted;
    }

    function setStringToTimestamp(str){
        var date = new Date(str);
        return Date.parse(date)*1000;
    }

    function updateNotice() {

        var body = angular.copy($scope.form);

        if(body.startDate){
            body.startDate = setStringToTimestamp(body.startDate);
        }

        if(body.endDate){
            body.endDate = setStringToTimestamp(body.endDate);
        }

        scope.loadingHandler.startLoading(LOADING.spinnerKey, 'updateNotice');
        scope.noticesManager.updateNoticeById(notice.id, body, function (status, data) {
            if (status == 200) {
                scope.noticeList[scope.currentIndex] = data;

                if (scope.params.type != COMMON.all && scope.params.type != body.type) {
                    scope.noticeList.splice(scope.currentIndex, 1);
                }

                $scope.exitEditMode();
            } else {
                scope.dialogHandler.alertError(status, data);
            }
            scope.loadingHandler.endLoading(LOADING.spinnerKey, 'updateNotice');
        });

    }

    function cancel() {
        $uibModalInstance.dismiss('cancel');
    }
}