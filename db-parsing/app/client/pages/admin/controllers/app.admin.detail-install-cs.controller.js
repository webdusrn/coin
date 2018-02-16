export default function DetailInstallCsCtrl ($scope, $rootScope, $uibModalInstance, VM, installCs, installCsManager, dialogHandler, metaManager, generateInstallCs) {
    'ngInject';

    var vm = $scope.vm = VM;

    vm.modalOpen = true;

    $scope.cancel = cancel;
    $scope.createCsMemo = createCsMemo;
    $scope.deleteCsMemo = deleteCsMemo;
    $scope.setEstimationSuccess = setEstimationSuccess;
    $scope.deleteRequestInstall = deleteRequestInstall;
    $scope.complete = complete;

    $scope.REQ_ESTIMATION = metaManager.std.reqEstimation;
    $scope.enumCsMemoStates = metaManager.std.csMemo.enumCsMemoStates.slice();
    $scope.form = {
        csMemoState: metaManager.std.csMemo.defaultCsMemoState
    };
    $scope.csMemos = {
        count: 0,
        rows: []
    };

    if (installCs) {
        reloadInstallCs(installCs);
    }

    function createCsMemo () {
        var body = angular.copy($scope.form);
        body.reqEstimationId = installCs.id;
        installCsManager.createCsMemo(body, function (status, data) {
            if (status == 201) {
                $scope.form = {
                    csMemoState: metaManager.std.csMemo.defaultCsMemoState
                };
                $scope.csMemos.rows.unshift(data);
                $scope.csMemos.count++;
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function deleteCsMemo (csMemo, index) {
        installCsManager.deleteCsMemo(csMemo, function (status, data) {
            if (status == 204) {
                $scope.csMemos.count--;
                $scope.csMemos.rows.splice(index, 1);
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function complete () {
        installCsManager.complete(installCs.id, function (status, data) {
            if (status == 204) {
                reloadInstallCs(installCs);
                $rootScope.$broadcast('app.admin.install-cs-update', {
                    installCs: installCs
                });
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }
    
    function deleteRequestInstall () {
        installCsManager.deleteRequestInstall(installCs.id, function (status, data) {
            if (status == 204) {
                reloadInstallCs(installCs);
                $rootScope.$broadcast('app.admin.install-cs-update', {
                    installCs: installCs
                });
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function setEstimationSuccess (estimation) {
        installCsManager.setEstimationSuccess(estimation.id, function (status, data) {
            if (status == 204) {
                reloadInstallCs(installCs);
                $rootScope.$broadcast('app.admin.install-cs-update', {
                    installCs: installCs
                });
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function reloadInstallCs (target) {
        installCsManager.findInstallCsById(target.id, function (status, data) {
            if (status == 200) {
                generateInstallCs(data);
                $scope.installCs = data;
                installCsManager.findCsMemos({
                    reqEstimationId: installCs.id
                }, function (status, data) {
                    if (status == 200) {
                        $scope.csMemos = data;
                    }
                });
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function cancel() {
        $uibModalInstance.dismiss('cancel');
    }
}