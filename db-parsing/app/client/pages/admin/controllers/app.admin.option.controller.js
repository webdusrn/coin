export default function OptionCtrl ($scope, $uibModal, metaManager, optionsManager, dialogHandler) {
    'ngInject';

    var vm = $scope.vm;
    var TOTAL_SIDO = '전체시도';
    var TOTAL_SIGUNGU = '전체시군구';
    var sigunguArray = {};

    vm.activeNav = 'option';

    $scope.enumSearchFields = metaManager.std.option.enumSearchFields;
    $scope.enumOrderBys = metaManager.std.option.enumOrderBys;
    $scope.enumSortTypes = metaManager.std.common.enumSortTypes;
    $scope.enumTypes = ['noType'].concat(metaManager.std.option.enumTypes);
    $scope.addressFields = [{
        name: TOTAL_SIDO,
        alias: TOTAL_SIDO,
        list: []
    }].concat(metaManager.std.addressFields);
    for (var i=0; i<$scope.addressFields.length; i++) {
        sigunguArray[$scope.addressFields[i].name] = $scope.addressFields[i].list.slice(1, $scope.addressFields[i].list.length);
    }
    $scope.enumSigungus = [TOTAL_SIGUNGU];

    $scope.findOptions = findOptions;
    $scope.openStats = openStats;

    $scope.more = false;
    $scope.form = {
        searchField: $scope.enumSearchFields[0],
        orderBy: metaManager.std.option.defaultOrderBy,
        sort: metaManager.std.common.DESC,
        size: metaManager.std.common.defaultLoadingLength,
        type: 'noType',
        sido: TOTAL_SIDO,
        sigungu: TOTAL_SIGUNGU
    };
    $scope.options = {
        count: 0,
        rows: []
    };

    $scope.$watch('form.sido', function (n, o) {
        if (n != o) {
            $scope.form.sigungu = TOTAL_SIGUNGU;
            $scope.enumSigungus = [TOTAL_SIGUNGU].concat(sigunguArray[n]);
        }
    }, true);

    $scope.$watch('form', function (n, o) {
        if (n != o) {
            findOptions(true);
        }
    }, true);

    findOptions(true);

    function findOptions (refresh) {
        var offset = null;
        if (refresh) {
            $scope.options = {
                count: 0,
                rows: []
            };
        } else {
            offset = $scope.options.rows.length;
        }
        var query = angular.copy($scope.form);
        if (offset) query.offset = offset;
        if (query.type == 'noType') delete query.type;
        if (query.sido == TOTAL_SIDO) delete query.sido;
        if (query.sigungu == TOTAL_SIGUNGU) delete query.sigungu;
        optionsManager.findOptions(query, function (status, data) {
            if (status == 200) {
                if (refresh) {
                    $scope.options = data;
                } else {
                    $scope.options.rows = $scope.options.rows.concat(data.rows);
                }
                $scope.more = $scope.options.rows.length < $scope.options.count;
            } else if (status == 404) {
                $scope.more = false;
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function openStats (size) {
        var instance = $uibModal.open({
            animation: false,
            backdrop: 'static',
            templateUrl: 'myEngineerStats.html',
            controller: 'EngineerStatsCtrl',
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