export default function ReqEstimationStatsCtrl ($scope, $uibModalInstance, VM, reqEstimationStatsManager, dialogHandler, metaManager) {
    'ngInject';

    var vm = $scope.vm = VM;
    var STATS = metaManager.std.stats;
    var now = new Date();
    var startYear = 2017;
    var TOTAL_DATE = '전쳬일';
    var TOTAL_TYPE = '전체유형';
    var TOTAL_SIDO = '전체시도';
    var TOTAL_SIGUNGU = '전체시군구';
    var sigunguArray = {};
    vm.modalOpen = true;

    $scope.active = active;
    $scope.cancel = cancel;

    $scope.enumYears = [startYear.toString()];
    $scope.enumMonths = [];
    for (var i=0; i<now.getFullYear() - startYear; i++) {
        $scope.enumYears.unshift((startYear + i + 1).toString());
    }
    for (var i=1; i<13; i++) {
        $scope.enumMonths.push(i.toString());
    }
    $scope.enumDates = [TOTAL_DATE];
    for (var i=1; i<=new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate(); i++) {
        $scope.enumDates.push(i.toString());
    }
    $scope.enumReqEstimationTypes = [TOTAL_TYPE].concat(metaManager.std.reqEstimation.enumTypes);
    $scope.addressFields = [{
        name: TOTAL_SIDO,
        alias: TOTAL_SIDO,
        list: []
    }].concat(metaManager.std.addressFields);
    for (var i=0; i<$scope.addressFields.length; i++) {
        sigunguArray[$scope.addressFields[i].name] = $scope.addressFields[i].list.slice(1, $scope.addressFields[i].list.length);
    }
    $scope.enumSigungus = [TOTAL_SIGUNGU];
    $scope.TOTAL_SIDO = TOTAL_SIDO;

    $scope.form = {
        year: now.getFullYear().toString(),
        month: (now.getMonth() + 1).toString(),
        date: TOTAL_DATE,
        reqEstimationType: TOTAL_TYPE,
        sido: TOTAL_SIDO,
        sigungu: TOTAL_SIGUNGU,
        startDate: '',
        endDate: ''
    };

    $scope.stats = {
        count: 0,
        rows: []
    };

    $scope.activeTab = 0;
    active(1);

    $scope.$watch('form', function (n, o) {
        if (n != o) {
            if (n.sido != o.sido) {
                $scope.form.sigungu = TOTAL_SIGUNGU;
                $scope.enumSigungus = [TOTAL_SIGUNGU].concat(sigunguArray[n.sido]);
            }
            if (n.month != o.month || n.year != o.year) {
                $scope.form.date = TOTAL_DATE;
                $scope.enumDates = [TOTAL_DATE];
                for (var i=1; i<=new Date(n.year, n.month, 0).getDate(); i++) {
                    $scope.enumDates.push(i.toString());
                }
            }
            active();
        }
    }, true);

    function active (tab) {
        if (tab) {
            $scope.activeTab = tab;
        }
        getStats($scope.activeTab);
    }

    function getStats (tab) {
        $scope.stats = {
            count: 0,
            rows: []
        };
        var query = angular.copy($scope.form);
        if (query.date == TOTAL_DATE) delete query.date;
        if (query.reqEstimationType == TOTAL_TYPE) delete query.reqEstimationType;
        if (query.sigungu == TOTAL_SIGUNGU) delete query.sigungu;
        if (query.sido == TOTAL_SIDO) {
            delete query.sido;
            delete query.sigungu;
        }
        if (tab == 1) {
            query.type = STATS.typePerDate;
        } else if (tab == 2) {
            query.type = STATS.typePerMonth;
        } else if (tab == 3) {
            query.type = STATS.typePerTime;
        } else if (tab == 4) {
            query.type = STATS.typePerLocation;
        } else {
            return false;
        }
        reqEstimationStatsManager.getReqEstimationStats(query, function (status, data) {
            if (status == 200) {
                $scope.stats = data;
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function cancel() {
        $uibModalInstance.dismiss('cancel');
    }
}