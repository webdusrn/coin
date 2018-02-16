export default function OpenHistoryCtrl ($scope, $uibModalInstance, VM, reqEstimation, pointHistoriesManager, dialogHandler) {
    'ngInject';

    var vm = $scope.vm = VM;
    vm.modalOpen = true;

    $scope.cancel = cancel;

    $scope.pointHistories = {
        count: 0,
        rows: []
    };

    if (reqEstimation) {
        pointHistoriesManager.findPointHistories({
            reqEstimationId: reqEstimation.id
        }, function (status, data) {
            if (status == 200) {
                $scope.pointHistories = data;
            } else {
                dialogHandler.alertError(status, data);
                cancel();
            }
        });
    }

    function cancel() {
        $uibModalInstance.dismiss('cancel');
    }
}