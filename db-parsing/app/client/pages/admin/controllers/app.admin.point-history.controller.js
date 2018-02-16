export default function PointHistoryCtrl ($scope, $uibModal, metaManager, pointHistoriesManager, dialogHandler) {
    'ngInject';

    var vm = $scope.vm;

    vm.activeNav = 'point-history';

    $scope.enumSearchFields = metaManager.std.pointHistory.enumSearchFields;
    $scope.enumTypes = ['totalPointHistoryType'].concat(metaManager.std.pointHistory.enumTypes);

    $scope.findPointHistories = findPointHistories;
    $scope.detailPointHistory = detailPointHistory;
    $scope.createPointHistory = createPointHistory;

    $scope.more = false;
    $scope.form = {
        orderBy: metaManager.std.pointHistory.defaultOrderBy,
        sort: metaManager.std.common.DESC,
        type: 'totalPointHistoryType',
        searchField: $scope.enumSearchFields[0],
        size: metaManager.std.common.defaultLoadingAdminLength
    };
    $scope.pointHistories = {
        count: 0,
        rows: []
    };

    $scope.$watch('form.type', function (newVal, oldVal) {
        if (newVal != oldVal) {
            findPointHistories(true);
        }
    }, true);

    findPointHistories(true);

    function findPointHistories (refresh) {
        var last = null;
        if (refresh) {
            $scope.pointHistories = {
                count: 0,
                rows: []
            };
        } else {
            last = $scope.pointHistories.rows[$scope.pointHistories.rows.length - 1][$scope.form.orderBy];
        }
        var query = angular.copy($scope.form);
        if (query.type == 'totalPointHistoryType') delete query.type;
        if (last) query.last = last;
        pointHistoriesManager.findPointHistories(query, function (status, data) {
            if (status == 200) {
                if (refresh) {
                    $scope.pointHistories = data;
                } else {
                    $scope.pointHistories.rows = $scope.pointHistories.rows.concat(data.rows);
                }
                $scope.more = $scope.pointHistories.rows.length < $scope.pointHistories.count;
            } else if (status == 404) {
                $scope.more = false;
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function createPointHistory () {
        var createInstance = $uibModal.open({
            animation: false,
            backdrop: true,
            templateUrl: 'myCreatePointHistory.html',
            controller: 'CreatePointHistoryCtrl',
            size: 'md',
            resolve: {
                VM: function () {
                    return vm;
                }
            }
        });

        createInstance.result.then(function (result) {
            vm.modalOpen = false;
            if ($scope.form.type != 'totalPointHistoryType' && $scope.form.type != result.type) {
                return false;
            } else {
                $scope.pointHistories.count++;
                $scope.pointHistories.rows.unshift(result);
            }
        }, function () {
            vm.modalOpen = false;
            console.log("cancel modal page");
        });
    }

    function detailPointHistory (item, size) {
        if (item.reqEstimation) {
            var instance = $uibModal.open({
                animation: false,
                backdrop: true,
                templateUrl: 'myDetailReqEstimation.html',
                controller: 'DetailReqEstimationCtrl',
                size: size,
                resolve: {
                    VM: function () {
                        return vm;
                    },
                    reqEstimation: function () {
                        return item.estimation.reqEstimation;
                    }
                }
            });

            instance.result.then(function (result) {
                vm.modalOpen = false;
            }, function () {
                vm.modalOpen = false;
                console.log("cancel modal page");
            });
        }
    }
}