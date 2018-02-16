export default function NoticesCtrl($scope, $rootScope, $sce, $filter, $uibModal, noticesManager, dialogHandler, loadingHandler, metaManager) {
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
    var NOTICE = metaManager.std.notice;
    var ADMIN = metaManager.std.admin;
    vm.FLAG = metaManager.std.flag;

    $scope.noticesManager = noticesManager;
    $scope.dialogHandler = dialogHandler;
    $scope.loadingHandler = loadingHandler;
    $scope.metaManager = metaManager;

    $scope.params = {};

    $scope.noticeList = [];
    $scope.noticeListTotal = 0;

    $scope.noticeTypes = angular.copy(NOTICE.enumNoticeTypes);
    $scope.noticeTypes.unshift(COMMON.all);
    $scope.params.type = $scope.noticeTypes[0];


    var LOCAL = metaManager.local;
    var enumCountries = [];
    for (var k in LOCAL.countries) {
        enumCountries.push(k);
    }

    $scope.noticeCountries = enumCountries;

    $scope.noticeSearchFields = NOTICE.enumFields;
    $scope.params.searchField = $scope.noticeSearchFields[0];

    $scope.more = false;

    $scope.showItemOption = showItemOption;
    $scope.hideItemOption = hideItemOption;
    $scope.findNotices = findNotices;
    $scope.findNoticesMore = findNoticesMore;
    $scope.deleteNotice = deleteNotice;
    $scope.showNoticeDetailAndStartEditMode = showNoticeDetailAndStartEditMode;
    $scope.openCreateModal = openCreateModal;
    $scope.openDetailModal = openDetailModal;

    // $scope.$on('$locationChangeStart', function (event, next, current) {
    //     if (next != current) {
    //         if ($scope.isNoticeDetailVisible) {
    //             event.preventDefault();
    //             $scope.hideNoticeDetail();
    //         }
    //     }
    // });

    $scope.currentOption = undefined;

    function showItemOption($event, notice) {
        $event.stopPropagation();
        $scope.currentOption = notice.id;
    }

    function hideItemOption() {
        $scope.currentOption = undefined;
    }

    function findNotices() {
        $scope.noticeListTotal = 0;
        $scope.noticeList = [];

        $scope.params.last = undefined;

        loadingHandler.startLoading(LOADING.spinnerKey, 'findNotices');
        noticesManager.findNotices($scope.params, function (status, data) {
            if (status == 200) {
                $scope.noticeListTotal = data.count;
                $scope.noticeList = $scope.noticeList.concat(data.rows);
                $scope.more = $scope.noticeListTotal > $scope.noticeList.length;
            } else if (status == 404) {
                $scope.more = false;
            } else {
                dialogHandler.alertError(status, data);
            }

            loadingHandler.endLoading(LOADING.spinnerKey, 'findNotices');
        });
    }

    function findNoticesMore() {
        if ($scope.noticeList.length > 0) {
            $scope.params.last = $scope.noticeList[$scope.noticeList.length - 1].createdAt;
        }

        loadingHandler.startLoading(LOADING.spinnerKey, 'findNoticesMore');
        noticesManager.findNotices($scope.params, function (status, data) {
            if (status == 200) {
                $scope.noticeList = $scope.noticeList.concat(data.rows);
                $scope.more = $scope.noticeListTotal > $scope.noticeList.length;
            } else if (status == 404) {
                $scope.more = false;
            } else {
                dialogHandler.alertError(status, data);
            }

            loadingHandler.endLoading(LOADING.spinnerKey, 'findNoticesMore');
        });
    }

    function deleteNotice(index) {

        dialogHandler.show('', $filter('translate')('sureDelete'), $filter('translate')('delete'), true, function () {

            var notice = $scope.noticeList[index];

            loadingHandler.startLoading(LOADING.spinnerKey, 'deleteNotice');
            noticesManager.deleteNotice(notice, function (status, data) {

                if (status == 204) {
                    $scope.noticeListTotal--;
                    $scope.noticeList.splice(index, 1);
                } else {
                    dialogHandler.alertError(status, data);
                }

                loadingHandler.endLoading(LOADING.spinnerKey, 'deleteNotice');

            });

        });

    }

    function showNoticeDetailAndStartEditMode(index) {
        openDetailModal(index, true);
    }

    function openCreateModal() {

        var createInstance = $uibModal.open({
            animation: ADMIN.isUseModalAnimation,
            backdrop: ADMIN.modalBackDrop,
            templateUrl: 'coreNoticeCreate.html',
            controller: 'NoticeCreateCtrl',
            size: NOTICE.modalSize,
            resolve: {
                scope: function () {
                    return $scope;
                }
            }
        });

        createInstance.result.then(function (result) {

        }, function () {
            console.log("cancel modal page");
        });
    }

    function openDetailModal(index, isEditMode) {
        $scope.currentIndex = index;
        var notice = $scope.noticeList[index];

        var createInstance = $uibModal.open({
            animation: ADMIN.isUseModalAnimation,
            backdrop: ADMIN.modalBackDrop,
            templateUrl: 'coreNoticeDetail.html',
            controller: 'NoticeDetailCtrl',
            size: NOTICE.modalSize,
            resolve: {
                scope: function () {
                    return $scope;
                },
                notice: function () {
                    return notice;
                },
                isEditMode: function () {
                    return isEditMode
                }
            }
        });

        createInstance.result.then(function (result) {

        }, function () {
            console.log("cancel modal page");
        });
    }

    $scope.$watch('params.type', function (newVal, oldVal) {
        if (newVal != oldVal) {
            $scope.findNotices();
        }
    }, true);

    $rootScope.$broadcast(ADMIN.kNavigation, {
        activeNav: ADMIN.moduleNotices
    });

    findNotices();

}