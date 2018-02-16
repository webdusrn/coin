export default function HeaderCtrl($scope, sessionManager, dialogHandler, loadingHandler) {
    "ngInject";

    var vm = $scope.vm;
    // vm.headerToIndex = headerToIndex;
    // vm.headerToLogin = headerToLogin;
    //
    // function headerToIndex () {
    //     vm.initMenuControl();
    //     vm.navigator.goToIndex();
    // }
    //
    // function headerToLogin () {
    //     vm.initMenuControl();
    //     vm.navigator.goToLogin();
    // }

    vm.logout = function () {
        loadingHandler.startLoading(vm.LOADING.spinnerKey, 'logout');
        sessionManager.logout(function (status, data) {
            if (status == 204) {
                vm.session = undefined;
                // vm.isLoginVisible = true;
                // vm.isContentVisible = false;
                vm.goLogin();

            } else {
                dialogHandler.alertError(status, data);
            }
            loadingHandler.endLoading(vm.LOADING.spinnerKey, 'logout');
        });
    };
}