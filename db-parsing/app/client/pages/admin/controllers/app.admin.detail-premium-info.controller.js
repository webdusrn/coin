export default function DetailPremiumInfoCtrl ($scope, $rootScope, $filter, $uibModalInstance, VM, premiumInfo, premiumInfosManager, metaManager, dialogHandler) {
    'ngInject';

    var vm = $scope.vm = VM;
    var MAGIC = metaManager.std.magic;
    var PREMIUM_INFO = metaManager.std.premiumInfo;
    var PLAN = PREMIUM_INFO.plan;
    var date = $filter('date');

    vm.modalOpen = true;

    $scope.authorization = authorization;
    $scope.unauthorization = unauthorization;
    $scope.selectLocation = selectLocation;
    $scope.cancel = cancel;

    $scope.PREMIUM_INFO = PREMIUM_INFO;
    $scope.premiumInfo = premiumInfo;
    $scope.lastCompletePremiumInfo = null;
    $scope.form = {};

    if (premiumInfo) {
        reloadPremiumInfo(premiumInfo);
    }

    $scope.$watch('form.startDate', function (n, o) {
        if (n != o && n) {
            var startDate = new Date(n);
            $scope.form.endDate = new Date(startDate.getFullYear(), startDate.getMonth() + PLAN[premiumInfo.plan].periodMonth, startDate.getDate());
        }
    }, true);

    function reloadPremiumInfo (target) {
        premiumInfosManager.findPremiumInfoById(target.id, function (status, data) {
            if (status == 200) {
                $rootScope.$broadcast('app.admin.reload-premium-info', {
                    premiumInfo: angular.copy(data)
                });
                $scope.premiumInfo = angular.copy(data);
                delete data.startDate;
                delete data.endDate;
                delete data.sidos;
                delete data.sigungus;
                $scope.form = angular.copy(data);
                if (data.state == PREMIUM_INFO.premiumStateStandby) {
                    findLastCompletePremiumInfo(data);
                }
                generateSidoSigungus();
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function findLastCompletePremiumInfo (premiumInfo) {
        $scope.form.expirationDay = 3;
        premiumInfosManager.findLastCompletePremiumInfo(premiumInfo, function (status, data) {
            if (status == 200) {
                $scope.lastCompletePremiumInfo = data;
            } else if (status == 404) {
                $scope.lastCompletePremiumInfo = null;
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function authorization () {
        $scope.form.sidos = [];
        $scope.form.sigungus = [];
        $scope.premiumInfo.sidoSigungus.forEach(function (sidoSigungu) {
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
        premiumInfosManager.authorization($scope.form, function (status, data) {
            if (status == 204) {
                reloadPremiumInfo(premiumInfo);
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function unauthorization () {
        premiumInfosManager.unauthorization($scope.form, function (status, data) {
            if (status == 204) {
                reloadPremiumInfo(premiumInfo);
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function generateSidoSigungus () {
        var sidoSigungus = [];
        var sidos = $scope.premiumInfo.sidos.split(',');
        var sigungus = $scope.premiumInfo.sigungus.split(',');
        var completeHash = {};
        var completePremiumLocations = $scope.premiumInfo.completePremiumLocations;
        for (var i=0; i<completePremiumLocations.length; i++) {
            var hash = completePremiumLocations[i].sido;
            if (completePremiumLocations[i].sigungu) hash += '_' + completePremiumLocations[i].sigungu;
            completeHash[hash] = i;
        }
        var ownHash = {};
        var premiumLocations = $scope.premiumInfo.premiumLocations;
        for (var i=0; i<premiumLocations.length; i++) {
            var hash = premiumLocations[i].sido;
            if (premiumLocations[i].sigungu) hash += '_' + premiumLocations[i].sigungu;
            ownHash[hash] = i;
        }
        var priceHash = {};
        var premiumPrices = $scope.premiumInfo.premiumPrices;
        for (var i=0; i<premiumPrices.length; i++) {
            var hash = premiumPrices[i].sido;
            if (premiumPrices[i].sigungu) hash += '_' + premiumPrices[i].sigungu;
            priceHash[hash] = i;
        }
        $scope.premiumInfo.premiumPrice = 0;
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
                sidoSigungu.count = completePremiumLocations[completeHash[hash]].count;
            } else {
                sidoSigungu.count = 0;
            }
            if (priceHash[hash] !== undefined) {
                sidoSigungu.price = returnDiscount(premiumPrices[priceHash[hash]].price);
            }
            if (ownHash[hash] !== undefined) {
                sidoSigungu.select = true;
                $scope.premiumInfo.premiumPrice += sidoSigungu.price;
            }
            sidoSigungus.push(sidoSigungu);
        });
        $scope.premiumInfo.sidoSigungus = sidoSigungus;
    }

    function returnDiscount (price) {
        var result = price * PLAN[premiumInfo.plan].periodMonth;
        result += parseInt(result * PLAN[premiumInfo.plan].discountRate / 100);
        return result;
    }

    function selectLocation (sidoSigungu) {
        if ($scope.premiumInfo.state == PREMIUM_INFO.premiumStateStandby) {
            sidoSigungu.select = !sidoSigungu.select;
            if (sidoSigungu.select) {
                $scope.premiumInfo.premiumPrice += sidoSigungu.price;
            } else {
                $scope.premiumInfo.premiumPrice -= sidoSigungu.price;
            }
        }
    }

    function cancel() {
        $uibModalInstance.dismiss('cancel');
    }
}