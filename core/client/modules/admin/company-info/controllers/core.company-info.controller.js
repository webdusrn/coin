export default function CompanyInfoCtrl($scope, $rootScope, $filter, companyInfoManager, dialogHandler, loadingHandler, metaManager) {
    "ngInject";

    var vm = null;
    if ($scope.vm !== undefined) {
        vm = $scope.vm;
    } else {
        vm = $scope.vm = {};
    }

    var LOADING = metaManager.std.loading;
    var ADMIN = metaManager.std.admin;
    vm.FLAG = metaManager.std.flag;

    $scope.isCompanyInfoEditVisible = false;

    $scope.form = {};
    $scope.companyInfo = {};

    $scope.showCompanyInfoEdit = showCompanyInfoEdit;
    $scope.hideCompanyInfoEdit = hideCompanyInfoEdit;
    $scope.findCompanyInfo = findCompanyInfo;
    $scope.updateCompanyInfo = updateCompanyInfo;

    function showCompanyInfoEdit() {
        $scope.isCompanyInfoEditVisible = true;
        $scope.form = angular.copy($scope.companyInfo);
    }

    function hideCompanyInfoEdit() {
        $scope.isCompanyInfoEditVisible = false;
    }

    function findCompanyInfo() {
        loadingHandler.startLoading(LOADING.spinnerKey, 'findCompanyInfo');
        companyInfoManager.findCompanyInfo(function (status, data) {
            if (status == 200) {
                $scope.companyInfo = data;
            } else if (status == 404) {

            } else {
                dialogHandler.alertError(status, data);
            }

            loadingHandler.endLoading(LOADING.spinnerKey, 'findCompanyInfo');
        });
    }

    function updateCompanyInfo(companyInfo) {
        loadingHandler.startLoading(LOADING.spinnerKey, 'updateCompanyInfo');
        companyInfoManager.updateCompanyInfo(companyInfo, function (status, data) {
            if (status == 200) {
                $scope.companyInfo = data;
                $scope.hideCompanyInfoEdit();
            } else {
                dialogHandler.alertError(status, data);
            }
            loadingHandler.endLoading(LOADING.spinnerKey, 'updateCompanyInfo');
        });
    }

    $rootScope.$broadcast(ADMIN.kNavigation, {
        activeNav: ADMIN.moduleCompanyInfo
    });

    findCompanyInfo();
}