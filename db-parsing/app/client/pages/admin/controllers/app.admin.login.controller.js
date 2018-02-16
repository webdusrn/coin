export default function loginCtrl($scope, $filter, dialogHandler, sessionManager, loadingHandler) {
    "ngInject";

    var vm = $scope.vm;

    $scope.form = {
        uid: '',
        secret: ''
    };
    vm.session = {};

    $scope.login = function () {
        loadingHandler.startLoading(vm.LOADING.spinnerKey, 'loginWithPhoneId');
        sessionManager.loginWithPhoneId($scope.form.uid, $scope.form.secret, function (status, data) {
            if (status == 200) {

                if (data.role >= vm.USER.roleAdmin) {

                    vm.session = data;
                    // vm.isLoginVisible = false;
                    // vm.isContentVisible = true;

                    if (vm.session && vm.session.nick) {
                        vm.nickImg = vm.session.nick.substring(0, 1);
                    }

                    vm.goIndex();

                    $scope.invalidId = false;
                    $scope.invalidPassword = false;

                } else {
                    dialogHandler.show('', $filter('translate')('shouldBeAdmin'), '', true);
                }

            } else {
                if (data) {
                    if (data.code == '404_10') {
                        $scope.invalidId = true;
                        $scope.invalidPassword = false;
                    } else if (data.code == '403_1') {
                        $scope.invalidId = false;
                        $scope.invalidPassword = true;
                    } else {
                        dialogHandler.alertError(status, data);
                        $scope.invalidId = false;
                        $scope.invalidPassword = false;
                    }
                } else {
                    dialogHandler.alertError(status, data);
                    $scope.invalidId = false;
                    $scope.invalidPassword = false;
                }
            }

            loadingHandler.endLoading(vm.LOADING.spinnerKey, 'loginWithPhoneId');
        });

    };

}