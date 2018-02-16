export default function MassNotificationsCtrl($scope, $stateParams, $rootScope, $filter, $uibModal, massNotificationsManager, massNotificationConditionManager, massNotificationCsvManager, dialogHandler, loadingHandler, metaManager) {
    "ngInject";

    var vm = null;
    if ($scope.vm !== undefined) {
        vm = $scope.vm;
    } else {
        vm = $scope.vm = {};
    }

    vm.FLAG = metaManager.std.flag;

    var ADMIN = metaManager.std.admin;
    var LOADING = metaManager.std.loading;
    var COMMON = metaManager.std.common;
    var NOTIFICATION = metaManager.std.notification;

    $scope.metaManager = metaManager;
    $scope.dialogHandler = dialogHandler;
    $scope.loadingHandler = loadingHandler;
    $scope.massNotificationsManager = massNotificationsManager;
    $scope.massNotificationConditionManager = massNotificationConditionManager;
    $scope.massNotificationCsvManager = massNotificationCsvManager;

    $scope.showItemOption = showItemOption;
    $scope.hideItemOption = hideItemOption;
    $scope.deleteNotification = deleteNotification;
    $scope.findMassNotifications = findMassNotifications;
    $scope.openCreateModal = openCreateModal;
    $scope.openDetailModal = openDetailModal;

    $scope.params = {
        size: COMMON.defaultLoadingLength
    };

    $scope.massNotificationTotal = 0;
    $scope.massNotifications = [];
    $scope.sendTypes = angular.copy(NOTIFICATION.enumSendTypes);
    $scope.sendTypes.unshift(COMMON.all);
    $scope.params.sendType = $scope.sendTypes[0];

    $scope.searchFields = NOTIFICATION.enumSearchFields;
    $scope.params.searchField = $scope.searchFields[0];

    function showItemOption($event, massNotification) {
        $event.stopPropagation();
        $scope.currentOption = massNotification.id;
    }

    function hideItemOption() {
        $scope.currentOption = undefined;
    }

    function deleteNotification(index) {

        dialogHandler.show('', $filter('translate')('sureDelete'), $filter('translate')('delete'), true, function () {

            var notification = $scope.massNotifications[index];

            loadingHandler.startLoading(LOADING.spinnerKey, 'deleteNotice');
            massNotificationsManager.deleteMassNotification(notification, function (status, data) {

                if (status == 204) {
                    $scope.massNotifications.splice(index, 1);
                } else {
                    dialogHandler.alertError(status, data);
                }

                loadingHandler.endLoading(LOADING.spinnerKey, 'deleteNotice');

            });

        });

    }

    function findMassNotifications() {

        loadingHandler.startLoading(LOADING.spinnerKey, 'findMassNotifications');
        massNotificationsManager.findMassNotifications($scope.params, function (status, data) {

            if (status == 200) {
                $scope.massNotificationTotal = data.count;
                $scope.massNotifications = data.rows;
            } else if (status == 404) {
                $scope.massNotificationTotal = 0;
                $scope.massNotifications = [];
            } else {
                dialogHandler.alertError(status, data);
            }

            loadingHandler.endLoading(LOADING.spinnerKey, 'findMassNotifications');
        });
    }

    function openCreateModal(stateParams) {

        var createInstance = $uibModal.open({
            animation: ADMIN.isUseModalAnimation,
            backdrop: ADMIN.modalBackDrop,
            templateUrl: 'coreNotificationsCreate.html',
            controller: 'MassNotificationsCreateCtrl',
            size: NOTIFICATION.modalSize,
            resolve: {
                scope: function () {
                    return $scope;
                },
                params: function () {
                    return stateParams;
                }
            }
        });

        createInstance.result.then(function (newItem) {
            if (newItem) {

                if ($scope.params.sendType == COMMON.all || $scope.params.sendType == newItem.sendType) {
                    $scope.massNotifications.unshift(newItem);
                }

            }
        }, function () {
            console.log("cancel modal page");
        });
    }

    function openDetailModal(index) {

        var massNotification = $scope.massNotifications[index];

        var createInstance = $uibModal.open({
            animation: ADMIN.isUseModalAnimation,
            backdrop: ADMIN.modalBackDrop,
            templateUrl: 'coreNotificationsDetail.html',
            controller: 'MassNotificationsDetailCtrl',
            size: NOTIFICATION.modalSize,
            resolve: {
                scope: function () {
                    return $scope;
                },
                massNotification: function () {
                    return massNotification;
                }
            }
        });

        createInstance.result.then(function (newItem) {

        }, function () {
            console.log("cancel modal page");
        });
    }

    function autoOpenModal() {
        console.log($stateParams);
        if ($stateParams.type) {

            var stateParams = {
                type: $stateParams.type,
                notificationName: $stateParams.notificationName,
                title: $stateParams.title,
                body: $stateParams.body
            };

            openCreateModal(stateParams);
        }
    }

    findMassNotifications();
    autoOpenModal();

    $scope.$watch('params.sendType', function (newVal, oldVal) {
        if (newVal != oldVal) {
            findMassNotifications();
        }
    }, true);

    $scope.$watch('params.searchItem', function (newVal, oldVal) {
        if (newVal != oldVal) {
            console.log(newVal);
        }
    }, true);

    $rootScope.$broadcast(ADMIN.kNavigation, {
        activeNav: ADMIN.moduleNotification
    });

}