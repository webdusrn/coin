export default function ReportsCtrl($scope, $rootScope, $filter, $uibModal, reportsManager, dialogHandler, loadingHandler, metaManager) {
    "ngInject";

    var vm = null;
    if ($scope.vm !== undefined) {
        vm = $scope.vm;
    } else {
        vm = $scope.vm = {};
    }

    if (vm.CDN === undefined) {
        vm.CDN = metaManager.std.cdn;
    }

    var LOADING = metaManager.std.loading;
    var COMMON = metaManager.std.common;
    var REPORT = metaManager.std.report;
    var ADMIN = metaManager.std.admin;
    vm.FLAG = metaManager.std.flag;

    $scope.reportsManager = reportsManager;
    $scope.dialogHandler = dialogHandler;
    $scope.loadingHandler = loadingHandler;
    $scope.metaManager = metaManager;

    $scope.params = {};

    $scope.reportList = [];
    $scope.reportListTotal = 0;
    $scope.reportEnumSearchFields = REPORT.enumSearchFields;
    $scope.params.searchItem = '';
    $scope.params.searchField = $scope.reportEnumSearchFields[0];
    $scope.reportEnumSolved = angular.copy(REPORT.enumSolved);
    $scope.reportEnumSolved.unshift(COMMON.all);
    $scope.isSolved = $scope.reportEnumSolved[0];

    $scope.more = false;

    $scope.showReportDetail = showReportDetail;
    $scope.findReports = findReports;
    $scope.findReportsMore = findReportsMore;

    function showReportDetail(index) {
        $scope.currentIndex = index;

        openModal($scope.reportList[index]);
    }

    // $scope.$on('$locationChangeStart', function (event, next, current) {
    //     if (next != current) {
    //         if ($scope.isReportDetailVisible) {
    //             event.preventDefault();
    //             $scope.hideReportDetail();
    //         }
    //     }
    // });

    function toBooleanIsSolved() {
        if ($scope.isSolved == $scope.reportEnumSolved[0]) {
            $scope.params.isSolved = undefined;
        } else if ($scope.isSolved == $scope.reportEnumSolved[1]) {
            $scope.params.isSolved = true;
        } else if ($scope.isSolved == $scope.reportEnumSolved[2]) {
            $scope.params.isSolved = false;
        }
    }

    function findReports() {

        $scope.reportListTotal = 0;
        $scope.reportList = [];

        $scope.params.last = undefined;

        toBooleanIsSolved();

        loadingHandler.startLoading(LOADING.spinnerKey, 'findReports');
        reportsManager.findReports($scope.params, function (status, data) {
            if (status == 200) {
                $scope.reportListTotal = data.count;
                $scope.reportList = $scope.reportList.concat(data.rows);
                $scope.more = $scope.reportListTotal > $scope.reportList.length;
            } else if (status == 404) {
                $scope.more = false;
            } else {
                dialogHandler.alertError(status, data);
            }

            loadingHandler.endLoading(LOADING.spinnerKey, 'findReports');
        });
    }

    function findReportsMore() {

        if ($scope.reportList.length > 0) {
            $scope.params.last = $scope.reportList[$scope.reportList.length - 1].createdAt;
        }

        toBooleanIsSolved();

        loadingHandler.startLoading(LOADING.spinnerKey, 'findReportsMore');
        reportsManager.findReports($scope.params, function (status, data) {
            if (status == 200) {
                $scope.reportList = $scope.reportList.concat(data.rows);
                $scope.more = $scope.reportListTotal > $scope.reportList.length;
            } else if (status == 404) {
                $scope.more = false;
            } else {
                dialogHandler.alertError(status, data);
            }

            loadingHandler.endLoading(LOADING.spinnerKey, 'findReportsMore');
        });
    }

    function openModal(report) {

        var createInstance = $uibModal.open({
            animation: ADMIN.isUseModalAnimation,
            backdrop: ADMIN.modalBackDrop,
            templateUrl: 'coreReportDetail.html',
            controller: 'ReportDetailCtrl',
            size: REPORT.modalSize,
            resolve: {
                scope: function () {
                    return $scope;
                },
                report: function () {
                    return report;
                }
            }
        });

        createInstance.result.then(function (result) {

        }, function () {
            console.log("cancel modal page");
        });
    }

    $scope.$watch('isSolved', function (newVal, oldVal) {
        if (newVal != oldVal) {
            $scope.findReports();
        }
    }, true);

    $rootScope.$broadcast(ADMIN.kNavigation, {
        activeNav: ADMIN.moduleReports
    });

    findReports();
}