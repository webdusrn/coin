export default function AlertDialogCtrl($scope, dialogHandler, metaManager, Focus) {
    "ngInject";

    var vm = $scope.vm;
    vm.DIALOG = metaManager.std.dialog;
    dialogHandler.init(vm);

    vm.isDialogVisible = false;
    vm.alertTitle = '';
    vm.alertMsg = '';
    vm.isCloseBtnVisible = true;

    $scope.$on('$locationChangeStart', function (event, n, c) {

        if (vm.isDialogVisible == true) {
            vm.isDialogVisible = false;
        }

    });

    dialogHandler.listen(function (title, body, actionText, isCloseBtnVisible) {
        vm.isDialogVisible = true;
        vm.alertTitle = title;
        vm.alertMsg = body;

        if (isCloseBtnVisible) {
            if (isCloseBtnVisible == true) {
                vm.isCloseBtnVisible = isCloseBtnVisible;
            } else {
                vm.closeBtnText = isCloseBtnVisible;
            }
        }

        Focus('alertConfirmButton');

        if (actionText) {
            vm.alertAction = actionText;
        } else {
            vm.alertAction = undefined;
        }

    });

    vm.action = function () {
        vm.isDialogVisible = false;
        dialogHandler.action();
    };

    vm.closeDialog = function () {
        vm.isDialogVisible = false;
        dialogHandler.close();
    };
}