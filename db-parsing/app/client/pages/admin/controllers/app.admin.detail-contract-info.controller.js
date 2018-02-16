export default function DetailContractInfoCtrl ($scope, $rootScope, $uibModalInstance, VM, contractInfo, contractInfosManager, metaManager, dialogHandler) {
    'ngInject';

    var vm = $scope.vm = VM;
    var MAGIC = metaManager.std.magic;
    var CONTRACT_INFO = metaManager.std.contractInfo;

    vm.modalOpen = true;

    $scope.authorization = authorization;
    $scope.unauthorization = unauthorization;
    $scope.selectLocation = selectLocation;
    $scope.complete = complete;
    $scope.uncomplete = uncomplete;
    $scope.cancel = cancel;

    $scope.CONTRACT_INFO = CONTRACT_INFO;
    $scope.contractInfo = contractInfo;
    $scope.lastCompleteContractInfo = null;
    $scope.form = {};

    if (contractInfo) {
        reloadContractInfo(contractInfo);
    }

    $scope.$watch('form.startDate', function (n, o) {
        if (n != o && n) {
            var startDate = new Date(n);
            $scope.form.endDate = new Date(startDate.getFullYear() + 1, startDate.getMonth(), startDate.getDate());
        }
    }, true);

    function reloadContractInfo (target) {
        contractInfosManager.findContractInfoById(target.id, function (status, data) {
            if (status == 200) {
                $rootScope.$broadcast('app.admin.reload-contract-info', {
                    contractInfo: angular.copy(data)
                });
                $scope.contractInfo = angular.copy(data);
                delete data.startDate;
                delete data.endDate;
                delete data.sidos;
                delete data.sigungus;
                $scope.form = angular.copy(data);
                if (data.state == CONTRACT_INFO.contractStateStandby) {
                    findLastCompleteContractInfo(data);
                }
                generateSidoSigungus();
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function authorization () {
        $scope.form.sidos = [];
        $scope.form.sigungus = [];
        $scope.contractInfo.sidoSigungus.forEach(function (sidoSigungu) {
            if (sidoSigungu.select) {
                $scope.form.sidos.push(sidoSigungu.sido);
                if (sidoSigungu.sigungu) {
                    $scope.form.sigungus.push(sidoSigungu.sigungu);
                } else {
                    $scope.form.sigungus.push(MAGIC.empty);
                }
            }
        });
        if ($scope.form.sidos.length) {
            $scope.form.sidos = $scope.form.sidos.join(',');
        } else {
            delete $scope.form.sidos;
        }
        if ($scope.form.sigungus.length) {
            $scope.form.sigungus = $scope.form.sigungus.join(',');
        } else {
            delete $scope.form.sigungus;
        }
        contractInfosManager.authorization($scope.form, function (status, data) {
            if (status == 204) {
                reloadContractInfo(contractInfo);
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function unauthorization () {
        contractInfosManager.unauthorization($scope.form, function (status, data) {
            if (status == 204) {
                reloadContractInfo(contractInfo);
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }
    
    function uncomplete () {
        contractInfosManager.uncomplete($scope.form, function (status, data) {
            if (status == 204) {
                reloadContractInfo(contractInfo);
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function complete () {
        contractInfosManager.complete($scope.form, function (status, data) {
            if (status == 204) {
                reloadContractInfo(contractInfo);
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function findLastCompleteContractInfo (contractInfo) {
        contractInfosManager.findLastCompleteContractInfo(contractInfo, function (status, data) {
            if (status == 200) {
                $scope.lastCompleteContractInfo = data;
            } else if (status == 404) {
                $scope.lastCompleteContractInfo = null;
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function generateSidoSigungus () {
        var sidoSigungus = [];
        var sidos = $scope.contractInfo.sidos.split(',');
        var sigungus = $scope.contractInfo.sigungus.split(',');
        var completeHash = {};
        var completeContractLocations = $scope.contractInfo.completeContractLocations;
        for (var i=0; i<completeContractLocations.length; i++) {
            var hash = completeContractLocations[i].sido;
            if (completeContractLocations[i].sigungu) hash += '_' + completeContractLocations[i].sigungu;
            completeHash[hash] = i;
        }
        var ownHash = {};
        var contractLocations = $scope.contractInfo.contractLocations;
        for (var i=0; i<contractLocations.length; i++) {
            var hash = contractLocations[i].sido;
            if (contractLocations[i].sigungu) hash += '_' + contractLocations[i].sigungu;
            ownHash[hash] = i;
        }
        sidos.forEach(function (sido, index) {
            var hash = sido;
            var sidoSigungu = {
                sido: sido
            };
            if (sigungus[index] != MAGIC.empty) {
                sidoSigungu.sigungu = sigungus[index];
                hash += '_' + sigungus[index];
            }
            if (completeHash[hash] !== undefined) {
                sidoSigungu.count = completeContractLocations[completeHash[hash]].count;
            } else {
                sidoSigungu.count = 0;
            }
            if (ownHash[hash] !== undefined) {
                sidoSigungu.select = true;
            }
            sidoSigungus.push(sidoSigungu);
        });
        $scope.contractInfo.sidoSigungus = sidoSigungus;
    }

    function selectLocation (sidoSigungu) {
        if ($scope.contractInfo.state == CONTRACT_INFO.contractStateStandby) {
            sidoSigungu.select = !sidoSigungu.select;
        }
    }

    function cancel() {
        $uibModalInstance.dismiss('cancel');
    }
}