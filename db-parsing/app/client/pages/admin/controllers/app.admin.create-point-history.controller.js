export default function CreatePointHistoryCtrl ($scope, $uibModalInstance, VM, metaManager, dialogHandler, pointHistoriesManager) {
    'ngInject';

    var vm = $scope.vm = VM;
    vm.modalOpen = true;

    $scope.cancel = cancel;
    $scope.createPointHistory = createPointHistory;

    $scope.enumTypes = metaManager.std.pointHistory.enumTypes;
    $scope.form = {
        type: metaManager.std.pointHistory.pointHistoryAdmin,
        sgCash: 0,
        sgDeposit: 0
    };

    function createPointHistory () {
        var body = angular.copy($scope.form);
        pointHistoriesManager.createPointHistory(body, function (status, data) {
            if (status == 201) {
                $uibModalInstance.close(data);
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