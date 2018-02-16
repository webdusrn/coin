export default function DetailReqEstimationCtrl ($scope, $uibModalInstance, VM, reqEstimation, generate, dialogHandler, reqEstimationsManager, metaManager) {
    "ngInject";

    var vm = $scope.vm = VM;
    var REQ_ESTIMATION = metaManager.std.reqEstimation;
    vm.modalOpen = true;

    $scope.reqEstimation = null;

    $scope.cancel = cancel;

    if (reqEstimation) {
        reqEstimationsManager.findReqEstimationById(reqEstimation.id, function (status, data) {
            if (status == 200) {
                generate(data);
                $scope.reqEstimation = data;
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function cancel() {
        $uibModalInstance.dismiss('cancel');
    }
}
