export default function BlogStatsCtrl ($scope, $uibModalInstance, VM) {
    'ngInject';

    var vm = $scope.vm = VM;
    var now = new Date();
    var startYear = 2017;
    vm.modalOpen = true;

    $scope.cancel = cancel;

    $scope.enumYears = [startYear.toString()];
    $scope.enumMonths = [];
    for (var i=0; i<now.getFullYear() - startYear; i++) {
        $scope.enumYears.unshift((startYear + i + 1).toString());
    }
    for (var i=1; i<13; i++) {
        $scope.enumMonths.push(i.toString());
    }
    $scope.form = {
        blogTemplateId: null,
        year: now.getFullYear().toString(),
        month: (now.getMonth() + 1).toString()
    };

    function cancel() {
        $uibModalInstance.dismiss('cancel');
    }
}