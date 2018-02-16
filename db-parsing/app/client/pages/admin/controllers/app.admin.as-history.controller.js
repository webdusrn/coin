export default function AsHistoryCtrl ($scope, $uibModal, metaManager, dialogHandler, asHistoriesManager) {
    'ngInject';

    var vm = $scope.vm;
    var AS_HISTORY = metaManager.std.asHistory;
    var REQ_ESTIMATION = metaManager.std.reqEstimation;
    var selectedIndex = null;
    var now = new Date();

    vm.activeNav = 'as-history';

    $scope.findAsHistories = findAsHistories;
    $scope.detailAsHistory = detailAsHistory;

    $scope.REQ_ESTIMATION = REQ_ESTIMATION;
    $scope.AS_HISTORY = AS_HISTORY;
    $scope.todayZero = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    $scope.enumSearchFields = AS_HISTORY.enumSearchFields.slice();
    $scope.enumAsStates = ['totalAsState', 'asStateOver'].concat(AS_HISTORY.enumAsStates);
    $scope.enumAsCallStates = ['totalAsCallState'].concat(AS_HISTORY.enumAsCallStates);
    $scope.enumReqEstimationTypes = ['totalReqEstimationType'].concat(REQ_ESTIMATION.enumTypes);

    $scope.more = false;
    $scope.form = {
        orderBy: AS_HISTORY.defaultOrderBy,
        sort: metaManager.std.common.DESC,
        asState: $scope.enumAsStates[0],
        asCallState: $scope.enumAsCallStates[0],
        searchField: $scope.enumSearchFields[0],
        reqEstimationType: $scope.enumReqEstimationTypes[0]
    };
    $scope.asHistories = {
        count: 0,
        rows: []
    };

    $scope.$watch('form.asState', function (n, o) {
        if (n != o) {
            findAsHistories(true);
        }
    }, true);

    $scope.$watch('form.asCallState', function (n, o) {
        if (n != o) {
            findAsHistories(true);
        }
    }, true);

    $scope.$watch('form.reqEstimationType', function (n, o) {
        if (n != o) {
            findAsHistories(true);
        }
    }, true);

    $scope.$on('app.admin.reload-as-history', function (event, args) {
        if (args.asHistory) {
            $scope.asHistories.rows[selectedIndex] = args.asHistory;
        }
    });

    findAsHistories(true);

    function findAsHistories (refresh) {
        var last = null;
        if (refresh) {
            $scope.asHistories = {
                count: 0,
                rows: []
            };
        } else {
            last = $scope.asHistories.rows[$scope.asHistories.rows.length - 1][$scope.form.orderBy];
        }
        var query = angular.copy($scope.form);
        if (query.asState == $scope.enumAsStates[0]) {
            delete query.asState;
        } else if (query.asState == $scope.enumAsStates[1]) {
            delete query.asState;
            query.isNotComplete = true;
        }
        if (query.asCallState == $scope.enumAsCallStates[0]) delete query.asCallState;
        if (query.reqEstimationType == $scope.enumReqEstimationTypes[0]) delete query.reqEstimationType;
        if (last) query.last = last;
        asHistoriesManager.findAsHistories(query, function (status, data) {
            if (status == 200) {
                if (refresh) {
                    $scope.asHistories = data;
                } else {
                    $scope.asHistories.rows = $scope.asHistories.rows.concat(data.rows);
                }
                $scope.more = $scope.asHistories.rows.length < $scope.asHistories.count;
            } else if (status == 404) {
                $scope.more = false;
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function detailAsHistory (item, index, size) {
        selectedIndex = index;
        var instance = $uibModal.open({
            animation: false,
            backdrop: true,
            templateUrl: 'myDetailAsHistory.html',
            controller: 'DetailAsHistoryCtrl',
            size: size,
            resolve: {
                VM: function () {
                    return vm;
                },
                asHistory: function () {
                    return item;
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