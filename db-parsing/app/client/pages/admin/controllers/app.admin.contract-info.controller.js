export default function ContractInfoCtrl ($scope, $uibModal, metaManager, dialogHandler, contractInfosManager) {
    'ngInject';

    var vm = $scope.vm;
    var COMMON = metaManager.std.common;
    var CONTRACT_INFO = metaManager.std.contractInfo;
    var selectedIndex = null;

    vm.activeNav = 'contract-info';

    $scope.findContractInfos = findContractInfos;
    $scope.detailContractInfo = detailContractInfo;

    $scope.enumCategories = ['totalContractCategory'].concat(CONTRACT_INFO.enumCategories);
    $scope.enumStates = ['totalContractState'].concat(CONTRACT_INFO.enumStates);
    $scope.enumSearchFields = CONTRACT_INFO.enumSearchFields.slice();

    $scope.more = false;
    $scope.form = {
        orderBy: CONTRACT_INFO.defaultOrderBy,
        sort: COMMON.DESC,
        category: $scope.enumCategories[0],
        state: $scope.enumStates[0],
        searchField: $scope.enumSearchFields[0],
        searchItem: ''
    };
    $scope.contractInfos = {
        count: 0,
        rows: []
    };

    $scope.$watch('form.category', function (n, o) {
        if (n != o) {
            findContractInfos(true);
        }
    }, true);

    $scope.$watch('form.state', function (n, o) {
        if (n != o) {
            findContractInfos(true);
        }
    }, true);

    $scope.$on('app.admin.reload-contract-info', function (event, args) {
        if (args.contractInfo) {
            $scope.contractInfos.rows[selectedIndex] = args.contractInfo;
        }
    });

    findContractInfos(true);

    function findContractInfos (refresh) {
        var last = null;
        if (refresh) {
            $scope.contractInfos = {
                count: 0,
                rows: []
            };
        } else {
            last = $scope.contractInfos.rows[$scope.contractInfos.rows.length - 1][$scope.form.orderBy];
        }
        var query = angular.copy($scope.form);
        if (query.category == $scope.enumCategories[0]) delete query.category;
        if (query.state == $scope.enumStates[0]) delete query.state;
        if (last) query.last = last;
        contractInfosManager.findContractInfos(query, function (status, data) {
            if (status == 200) {
                if (refresh) {
                    $scope.contractInfos = data;
                } else {
                    $scope.contractInfos.rows = $scope.contractInfos.rows.concat(data.rows);
                }
                $scope.more = $scope.contractInfos.rows.length < $scope.contractInfos.count;
            } else if (status == 404) {
                $scope.more = false;
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function detailContractInfo (item, index, size) {
        selectedIndex = index;
        var instance = $uibModal.open({
            animation: false,
            backdrop: 'static',
            templateUrl: 'myDetailContractInfo.html',
            controller: 'DetailContractInfoCtrl',
            size: size,
            resolve: {
                VM: function () {
                    return vm;
                },
                contractInfo: function () {
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
}