export default function UsersCtrl($scope, $rootScope, $uibModal, $filter, usersManager, notificationManager, notificationBoxManager, notificationSwitchManager, notificationPublicSwitchManager, sessionRemoteManager, profileManager, dialogHandler, loadingHandler, metaManager) {
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

    vm.FLAG = metaManager.std.flag;

    $scope.usersManager = usersManager;
    $scope.dialogHandler = dialogHandler;
    $scope.loadingHandler = loadingHandler;
    $scope.metaManager = metaManager;
    $scope.notificationBoxManager = notificationBoxManager;
    $scope.notificationSwitchManager = notificationSwitchManager;
    $scope.notificationPublicSwitchManager = notificationPublicSwitchManager;
    $scope.sessionRemoteManager = sessionRemoteManager;
    $scope.profileManager = profileManager;

    $scope.openModal = openModal;

    $scope.showItemOption = showItemOption;
    $scope.hideItemOption = hideItemOption;
    $scope.showUserDetailAndStartEditMode = showUserDetailAndStartEditMode;

    $scope.deleteUser = deleteUser;

    $scope.findUsers = findUsers;
    $scope.findUsersMore = findUsersMore;

    var LOADING = metaManager.std.loading;
    var USER = metaManager.std.user;
    var ADMIN = metaManager.std.admin;

    $scope.currentOption = undefined;
    $scope.isUserEditMode = false;

    $scope.params = {};

    $scope.userList = [];
    $scope.userListTotal = 0;

    $scope.userEnumSearchFields = USER.enumSearchFields;
    $scope.params.searchField = $scope.userEnumSearchFields[0];

    $scope.userEnumRoles = angular.copy(USER.enumRoles);
    $scope.userEnumRoles.unshift(USER.roleAll);
    $scope.params.role = USER.roleAll;

    $scope.userEnumGender = angular.copy(USER.enumGenders);
    $scope.userEnumGender.unshift(USER.genderAll);
    $scope.params.gender = USER.genderAll;

    $scope.more = false;

    function showItemOption($event, user) {
        $event.stopPropagation();
        $scope.currentOption = user.id;
    }

    function hideItemOption() {
        $scope.currentOption = undefined;
    }

    function findUsers() {

        $scope.userListTotal = 0;
        $scope.userList = [];

        $scope.params.last = undefined;

        loadingHandler.startLoading(LOADING.spinnerKey, 'findAllUsers');
        usersManager.findAllUsers($scope.params, function (status, data) {
            if (status == 200) {
                $scope.userListTotal = data.count;
                $scope.userList = $scope.userList.concat(data.rows);
                $scope.more = $scope.userListTotal > $scope.userList.length;
            } else if (status == 404) {
                $scope.more = false;
            } else {
                dialogHandler.alertError(status, data);
            }

            loadingHandler.endLoading(LOADING.spinnerKey, 'findAllUsers');
        });
    }

    function findUsersMore() {

        if ($scope.userList.length > 0) {
            $scope.params.last = $scope.userList[$scope.userList.length - 1].createdAt;
        }

        loadingHandler.startLoading(LOADING.spinnerKey, 'findUsersMore');
        usersManager.findAllUsers($scope.params, function (status, data) {
            if (status == 200) {
                $scope.userList = $scope.userList.concat(data.rows);
                $scope.more = $scope.userListTotal > $scope.userList.length;
            } else if (status == 404) {
                $scope.more = false;
            } else {
                dialogHandler.alertError(status, data);
            }

            loadingHandler.endLoading(LOADING.spinnerKey, 'findUsersMore');
        });
    }

    function deleteUser(index) {

        dialogHandler.show('', $filter('translate')('sureDelete'), $filter('translate')('delete'), true, function () {

            var user = $scope.userList[index];

            loadingHandler.startLoading(LOADING.spinnerKey, 'deleteUser');
            usersManager.deleteUser(user, function (status, data) {

                if (status == 204) {
                    $scope.userList.splice(index, 1);
                } else {
                    dialogHandler.alertError(status, data);
                }

                loadingHandler.endLoading(LOADING.spinnerKey, 'deleteUser');

            });

        });

    }

    function showUserDetailAndStartEditMode(index) {
        openModal(index, true);
    }

    function openModal(index, isEditMode) {
        $scope.currentUserIndex = index;
        var user = $scope.userList[index];

        var createInstance = $uibModal.open({
            animation: ADMIN.isUseModalAnimation,
            backdrop: ADMIN.modalBackDrop,
            templateUrl: 'coreUserDetail.html',
            controller: 'UserDetailCtrl',
            size: USER.modalSize,
            resolve: {
                scope: function () {
                    return $scope;
                },
                user: function () {
                    return user;
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
            findUsers();
        }
    }, true);

    $scope.$watch('params.role', function (newVal, oldVal) {
        if (newVal != oldVal) {
            findUsers();
        }
    }, true);

    $scope.$watch('params.gender', function (newVal, oldVal) {
        if (newVal != oldVal) {
            findUsers();
        }
    }, true);

    findUsers();

    $rootScope.$broadcast(ADMIN.kNavigation, {
        activeNav: ADMIN.moduleUsers
    });

}