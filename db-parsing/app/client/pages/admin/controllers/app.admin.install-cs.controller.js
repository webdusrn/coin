export default function InstallCsCtrl ($scope, $uibModal, metaManager, installCsManager, dialogHandler) {
    'ngInject';

    var vm = $scope.vm;

    vm.activeNav = 'install-cs';
    var TOTAL_TYPE = 'totalReqEstimationType';
    var TOTAL_REQUEST_INSTALL_TYPE = 'totalRequestInstallType';
    var REQ_ESTIMATION = metaManager.std.reqEstimation;
    var ESTIMATION = metaManager.std.estimation;

    $scope.findInstallCss = findInstallCss;
    $scope.openDetailInstallCs = openDetailInstallCs;

    $scope.enumTypes = [TOTAL_TYPE].concat(metaManager.std.reqEstimation.enumTypes);
    $scope.enumRequestInstallTypes = [TOTAL_REQUEST_INSTALL_TYPE].concat(metaManager.std.requestInstall.enumTypes);

    $scope.more = false;
    $scope.form = {
        orderBy: 'createdAt',
        sort: metaManager.std.common.DESC,
        type: TOTAL_TYPE,
        requestInstallType: TOTAL_REQUEST_INSTALL_TYPE
    };
    $scope.installCss = {
        count: 0,
        rows: []
    };

    findInstallCss(true);

    $scope.$watch('form.requestInstallType', function (n, o) {
        if (n != o) {
            findInstallCss(true);
        }
    }, true);

    $scope.$watch('form.type', function (n, o) {
        if (n != o) {
            findInstallCss(true);
        }
    }, true);

    function findInstallCss (refresh) {
        var last = null;
        if (refresh) {
            $scope.installCss = {
                count: 0,
                rows: []
            };
        } else {
            last = $scope.installCss.rows[$scope.installCss.rows.length - 1][$scope.form.orderBy];
        }
        var query = angular.copy($scope.form);
        if (query.type == TOTAL_TYPE) delete query.type;
        if (query.requestInstallType == TOTAL_REQUEST_INSTALL_TYPE) delete query.requestInstallType;
        if (last) query.last = last;
        installCsManager.findInstallCss(query, function (status, data) {
            if (status == 200) {
                data.rows.forEach(function (installCs) {
                    generateInstallCs(installCs);
                });
                if (refresh) {
                    $scope.installCss = data;
                } else {
                    $scope.installCss.rows = $scope.installCss.rows.concat(data.rows);
                }
                $scope.more = $scope.installCss.rows.length < $scope.installCss.count;
            } else if (status == 404) {
                $scope.more = false;
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function generateInstallCs (installCs) {
        generateSuccessEstimation(installCs);
        generateCsState(installCs);
    }

    function generateCsState (installCs) {
        var csState;
        if (installCs.requestInstall && installCs.successEstimation && installCs.requestInstall.estimationId != installCs.successEstimation.id) {
            csState = '다른기사완료';
        } else if (installCs.requestInstall && installCs.requestInstall.estimation.transactionState == ESTIMATION.transactionStateFail) {
            csState = '요청기사설치실패';
        } else if (installCs.requestInstall && installCs.requestInstall.estimation.transactionState == ESTIMATION.transactionStateStandby) {
            csState = '요청기사완료대기';
        } else if (installCs.adminState == REQ_ESTIMATION.adminStateComplete && installCs.transactionState == REQ_ESTIMATION.transactionStateStandby) {
            csState = '요청되돌림';
        } else {
            csState = '기사기억안남';
        }
        installCs.csState = csState;
    }

    function generateSuccessEstimation (installCs) {
        var matchEstimations = installCs.matchEstimations;
        for (var i=0; i<matchEstimations.length; i++) {
            if (matchEstimations[i].state == ESTIMATION.stateSuccess) {
                installCs.successEstimation = angular.copy(matchEstimations[i]);
                break;
            }
        }
    }

    function openDetailInstallCs (installCs, index, size) {
        $scope.$on('app.admin.install-cs-update', function (event, args) {
            if (args.installCs) {
                installCsManager.findInstallCsById(args.installCs.id, function (status, data) {
                    if (status == 200) {
                        generateInstallCs(data);
                        $scope.installCss.rows[index] = data;
                    } else {
                        dialogHandler.alertError(status, data);
                    }
                });
            }
        });

        var instance = $uibModal.open({
            animation: false,
            backdrop: true,
            templateUrl: 'myDetailInstallCs.html',
            controller: 'DetailInstallCsCtrl',
            size: size,
            resolve: {
                VM: function () {
                    return vm
                },
                installCs: function () {
                    return installCs;
                },
                generateInstallCs: function () {
                    return generateInstallCs;
                }
            }
        });

        instance.result.then(function (result) {
            vm.modalOpen = false;
            installCsManager.findInstallCsById(result.id, function (status, data) {
                if (status == 200) {
                    generateInstallCs(data);
                    $scope.installCss.rows[index] = data;
                } else {
                    dialogHandler.alertError(status, data);
                }
            });
        }, function () {
            vm.modalOpen = false;
            console.log("cancel modal page");
        });
    }
}