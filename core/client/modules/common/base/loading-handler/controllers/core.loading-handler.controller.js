export default function LoadingHandlerCtrl ($scope, loadingHandler) {
    "ngInject";

    var vm = $scope.vm;
    loadingHandler.init(vm);

    loadingHandler.listen(function (progress, title) {

        vm.coreProgress = progress;
        vm.coreProgressTitle = title;

    });
}