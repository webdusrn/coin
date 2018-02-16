export default function CreateBlogAccountCtrl ($scope, $uibModalInstance, VM, blogAccountsManager, metaManager, dialogHandler) {
    'ngInject';

    var vm = $scope.vm = VM;
    vm.modalOpen = true;

    $scope.enumStates = metaManager.std.blogAccount.enumStates;

    $scope.cancel = cancel;
    $scope.createBlogAccount = createBlogAccount;

    $scope.form = {};

    function createBlogAccount () {
        var body = angular.copy($scope.form);
        console.log(blogAccountsManager);
        blogAccountsManager.createBlogAccount(body, function (status, data) {
            if (status == 201) {
                data.blogPostCount = 0;
                $uibModalInstance.close(data);
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function cancel() {
        $uibModalInstance.dismiss('cancel');
    }
}