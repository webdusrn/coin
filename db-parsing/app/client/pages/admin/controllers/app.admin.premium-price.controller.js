export default function PremiumPriceCtrl ($scope, $uibModalInstance, VM, premiumPricesManager, dialogHandler, metaManager) {
    'ngInject';

    var vm = $scope.vm = VM;
    var COMMON = metaManager.std.common;
    var PREMIUM_INFO = metaManager.std.premiumInfo;
    var addressFields = metaManager.std.addressFields;
    var enumSidos = [];

    for (var i=0; i<addressFields.length; i++) {
        enumSidos.push(addressFields[i].name);
    }

    vm.modalOpen = true;

    $scope.cancel = cancel;
    $scope.findPremiumPrices = findPremiumPrices;
    $scope.updatePremiumPrice = updatePremiumPrice;

    $scope.enumCategories = ['totalPremiumCategory'].concat(PREMIUM_INFO.enumCategories);
    $scope.enumSidos = ['전체 시/도'].concat(enumSidos);

    $scope.more = false;
    $scope.form = {
        orderBy: COMMON.id,
        sort: COMMON.ASC,
        size: COMMON.defaultLoadingAdminLength,
        category: $scope.enumCategories[0],
        sido: $scope.enumSidos[0]
    };
    $scope.premiumPrices = {
        count: 0,
        rows: []
    };

    $scope.$watch('form.category', function (n, o) {
        if (n != o) {
            findPremiumPrices(true);
        }
    }, true);

    $scope.$watch('form.sido', function (n, o) {
        if (n != o) {
            findPremiumPrices(true);
        }
    }, true);

    findPremiumPrices(true);

    function findPremiumPrices (refresh) {
        var last = null;
        if (refresh) {
            $scope.premiumPrices = {
                count: 0,
                rows: []
            };
        } else {
            last = $scope.premiumPrices.rows[$scope.premiumPrices.rows.length - 1][$scope.form.orderBy];
        }
        var query = angular.copy($scope.form);
        if (query.category == $scope.enumCategories[0]) delete query.category;
        if (query.sido == $scope.enumSidos[0]) delete query.sido;
        if (last) query.last = last;
        premiumPricesManager.findPremiumPrices(query, function (status, data) {
            if (status == 200) {
                if (refresh) {
                    $scope.premiumPrices = data;
                } else {
                    $scope.premiumPrices.rows = $scope.premiumPrices.rows.concat(data.rows);
                }
                $scope.more = $scope.premiumPrices.rows.length < $scope.premiumPrices.count;
            } else if (status == 404) {
                $scope.more = false;
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function updatePremiumPrice (premiumPrice) {
        premiumPricesManager.updatePremiumPrice(premiumPrice, function (status, data) {
            if (status == 204) {
                console.log("update success");
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function cancel() {
        $uibModalInstance.dismiss('cancel');
    }
}