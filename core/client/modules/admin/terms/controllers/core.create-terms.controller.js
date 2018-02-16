export default function CreateTermsCtrl ($scope, $uibModalInstance, scope, terms) {
    "ngInject";

    var now = new Date();
    $scope.localNow = (new Date(now.getTime() + 24*60*60*1000)).toDateString();

    $scope.enumTypes = scope.enumTypes;
    $scope.enumLanguages = scope.enumLanguages;

    if (!terms) {
        $scope.form = {};
        $scope.form.type = $scope.enumTypes[0];
        $scope.form.language = $scope.enumLanguages[0];
    } else {
        $scope.terms = terms;
        $scope.form = terms;
    }

    $scope.create = function () {
        var body = angular.copy($scope.form);
        scope.termsManager.createTerms(body, function (status, data) {
            if (status == 201) {
                $uibModalInstance.close(data);
            } else {
                scope.dialogHandler.alertError(status, data);
            }
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}