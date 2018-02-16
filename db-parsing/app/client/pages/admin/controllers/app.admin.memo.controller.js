export default function memoCtrl($scope, $uibModalInstance, VM, memo) {
    "ngInject";

    var vm = $scope.vm = VM;
    vm.modalOpen = true;

    $scope.cancel = cancel;

    if (memo) {
        $scope.memo = memo;
    }

    function cancel() {
        $uibModalInstance.dismiss('cancel');
    }

}
