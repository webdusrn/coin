export default function PremiumInfoCtrl ($scope, $uibModal, metaManager, dialogHandler, premiumInfosManager) {
    'ngInject';

    var vm = $scope.vm;
    var COMMON = metaManager.std.common;
    var PREMIUM_INFO = metaManager.std.premiumInfo;
    var selectedIndex = null;

    vm.activeNav = 'premium-info';

    $scope.findPremiumInfos = findPremiumInfos;
    $scope.detailPremiumInfo = detailPremiumInfo;
    $scope.openPrice = openPrice;

    $scope.enumCategories = ['totalPremiumCategory'].concat(PREMIUM_INFO.enumCategories);
    $scope.enumStates = ['totalPremiumState'].concat(PREMIUM_INFO.enumStates);
    $scope.enumPlans = ['전체 플랜'].concat(Object.keys(PREMIUM_INFO.plan));
    $scope.enumSearchFields = PREMIUM_INFO.enumSearchFields.slice();

    $scope.more = false;
    $scope.form = {
        orderBy: PREMIUM_INFO.defaultOrderBy,
        sort: COMMON.DESC,
        category: $scope.enumCategories[0],
        state: $scope.enumStates[0],
        plan: $scope.enumPlans[0],
        searchField: $scope.enumSearchFields[0],
        searchItem: ''
    };
    $scope.premiumInfos = {
        count: 0,
        rows: []
    };

    $scope.$watch('form.category', function (n, o) {
        if (n != o) {
            findPremiumInfos(true);
        }
    }, true);

    $scope.$watch('form.state', function (n, o) {
        if (n != o) {
            findPremiumInfos(true);
        }
    }, true);

    $scope.$watch('form.plan', function (n, o) {
        if (n != o) {
            findPremiumInfos(true);
        }
    }, true);

    $scope.$on('app.admin.reload-premium-info', function (event, args) {
        if (args.premiumInfo) {
            $scope.premiumInfos.rows[selectedIndex] = args.premiumInfo;
        }
    });

    findPremiumInfos(true);

    function findPremiumInfos (refresh) {
        var last = null;
        if (refresh) {
            $scope.premiumInfos = {
                count: 0,
                rows: []
            };
        } else {
            last = $scope.premiumInfos.rows[$scope.premiumInfos.rows.length - 1][$scope.form.orderBy];
        }
        var query = angular.copy($scope.form);
        if (query.category == $scope.enumCategories[0]) delete query.category;
        if (query.plan == $scope.enumPlans[0]) delete query.plan;
        if (query.state == $scope.enumStates[0]) delete query.state;
        if (last) query.last = last;
        premiumInfosManager.findPremiumInfos(query, function (status, data) {
            if (status == 200) {
                if (refresh) {
                    $scope.premiumInfos = data;
                } else {
                    $scope.premiumInfos.rows = $scope.premiumInfos.rows.concat(data.rows);
                }
                $scope.more = $scope.premiumInfos.rows.length < $scope.premiumInfos.count;
            } else if (status == 404) {
                $scope.more = false;
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function detailPremiumInfo (item, index, size) {
        selectedIndex = index;
        var instance = $uibModal.open({
            animation: false,
            backdrop: 'static',
            templateUrl: 'myDetailPremiumInfo.html',
            controller: 'DetailPremiumInfoCtrl',
            size: size,
            resolve: {
                VM: function () {
                    return vm;
                },
                premiumInfo: function () {
                    return item;
                }
            }
        });

        instance.result.then(function () {
            vm.modalOpen = false;
            console.log("cancel modal page");
        }, function () {
            vm.modalOpen = false;
            console.log("cancel modal page");
        });
    }

    function openPrice (size) {
        var instance = $uibModal.open({
            animation: false,
            backdrop: 'static',
            templateUrl: 'myPremiumPrice.html',
            controller: 'PremiumPriceCtrl',
            size: size,
            resolve: {
                VM: function () {
                    return vm;
                }
            }
        });

        instance.result.then(function () {
            vm.modalOpen = false;
            console.log("cancel modal page");
        }, function () {
            vm.modalOpen = false;
            console.log("cancel modal page");
        });
    }
}