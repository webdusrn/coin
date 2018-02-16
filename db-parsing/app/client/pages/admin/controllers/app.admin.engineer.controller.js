export default function EngineerCtrl($scope, errorHandler, loadingHandler, dialogHandler, engineerManager, $uibModal) {
    "ngInject";

    var vm = $scope.vm;
    var currentIndex = null;

    vm.activeNav = 'engineer';


    $scope.engineers = {
        count: 0,
        rows: []
    };
    $scope.more = false;
    $scope.enumSignUpTypes = vm.ENGINEERINFO.enumSignUpTypes;
    $scope.enumCanStates = vm.ENGINEERINFO.enumCanStates;
    $scope.engineerEnumSearchFields = vm.ENGINEERINFO.enumSearch;
    $scope.engineerVerifyFields = vm.ENGINEERINFO.enumVerify;
    $scope.engineerNeedScreeningFields = vm.ENGINEERINFO.enumNeedScreening;
    $scope.orderByEnumFields = vm.ENGINEERINFO.enumOrderBy;
    $scope.form = {
        searchField: 'name',
        searchItem: '',
        verifyType: '',
        needScreeningType: ''
    };

    findEngineer(true);

    $scope.findEngineer = findEngineer;
    $scope.createEngineerOpen = createEngineerOpen;

    $scope.$on('app.admin.delete-engineer-info-image', function (event, args) {
        var type = args.type;
        if (type == 'id') {
            $scope.engineers.rows[currentIndex].engineerInfo.idImageId = null;
            $scope.engineers.rows[currentIndex].engineerInfo.idImage = null;
        } else if (type == 'profile') {
            $scope.engineers.rows[currentIndex].engineerInfo.profileImageId = null;
            $scope.engineers.rows[currentIndex].engineerInfo.profileImage = null;
        } else if (type == 'air') {
            $scope.engineers.rows[currentIndex].engineerInfo.licenseImageId = null;
            $scope.engineers.rows[currentIndex].engineerInfo.licenseImage = null;
        } else if (type == 'business') {
            $scope.engineers.rows[currentIndex].engineerInfo.businessLicenseImageId = null;
            $scope.engineers.rows[currentIndex].engineerInfo.businessLicenseImage = null;
        } else if (type == 'boiler') {
            $scope.engineers.rows[currentIndex].engineerInfo.boilerLicenseImageId = null;
            $scope.engineers.rows[currentIndex].engineerInfo.boilerLicenseImage = null;
        } else if (type == 'construct') {
            $scope.engineers.rows[currentIndex].engineerInfo.constructImageId = null;
            $scope.engineers.rows[currentIndex].engineerInfo.constructImage = null;
        }
    });

    function findEngineer(refresh) {
        var last = null;
        if (refresh) {
            $scope.more = false;
            $scope.engineers = {
                count: 0,
                rows: []
            };
        } else {
            last = $scope.engineers.rows[$scope.engineers.rows.length - 1].createdAt;
        }
        var query = {
            size: vm.COMMON.defaultLoadingLength
        };
        if (last) query.last = last;
        if ($scope.form.needScreeningType) query.needScreening = ($scope.form.needScreeningType == 'isNeedScreening');
        if ($scope.form.searchField) query.searchField = $scope.form.searchField;
        if ($scope.form.searchItem) query.searchItem = $scope.form.searchItem;
        if ($scope.form.verifyType) {
            query.role = $scope.form.verifyType;
        } else {
            query.role = $scope.engineerVerifyFields.join(',');
        }

        if ($scope.form.orderBy) query.orderBy = $scope.form.orderBy;

        if ($scope.form.canAirConditionerState) query.canAirConditionerState = $scope.form.canAirConditionerState;
        if ($scope.form.canWallTvState) query.canWallTvState = $scope.form.canWallTvState;
        if ($scope.form.canDoorLockState) query.canDoorLockState = $scope.form.canDoorLockState;
        if ($scope.form.canWindowScreenState) query.canWindowScreenState = $scope.form.canWindowScreenState;
        if ($scope.form.canBoilerState) query.canBoilerState = $scope.form.canBoilerState;
        if ($scope.form.signUpType) query.signUpType = $scope.form.signUpType;

        loadingHandler.startLoading(vm.LOADING.spinnerKey, "findConsult");
        engineerManager.findEngineer(query, function (status, data) {
            if (status == 200) {
                if (refresh) {
                    $scope.engineers = data;
                } else {
                    $scope.engineers.rows = $scope.engineers.rows.concat(data.rows);
                }
                $scope.more = $scope.engineers.rows.length < $scope.engineers.count;
            } else if (status == 404) {
                $scope.more = false;
                $scope.engineers = {
                    count: 0,
                    rows: []
                };
            } else {
                dialogHandler.alertError(status, data);
            }
            loadingHandler.endLoading(vm.LOADING.spinnerKey, "findConsult");
        });
    }


    function createEngineerOpen(size, engineer, index) {
        currentIndex = index;

        var createInstance = $uibModal.open({
            animation: false,
            templateUrl: 'myCreateEngineer.html',
            controller: 'CreateEngineerCtrl',
            size: size,
            backdrop: true,
            resolve: {
                VM: function () {
                    return vm;
                },
                engineer: function () {
                    return engineer;
                }
            }
        });

        createInstance.result.then(function (result) {

            vm.modalOpen = false;
            if ($scope.form.verifyType || $scope.form.needScreeningType || $scope.form.canAirConditionerState || $scope.form.canAirConditionerCleanState || $scope.form.canWallTvState || $scope.form.canDoorLockState || $scope.form.canWindowScreenState || $scope.form.canBoilerState) {
                if ($scope.form.verifyType != result.role || $scope.form.needScreeningType == 'isNeedScreening') {
                    $scope.engineers.count--;
                    $scope.engineers.rows.splice(index, 1);
                } else if (($scope.form.canAirConditionerState && $scope.form.canAirConditionerState != result.canAirConditionerState) ||
                    ($scope.form.canAirConditionerCleanState && $scope.form.canAirConditionerCleanState != result.canAirConditionerCleanState) ||
                    ($scope.form.canWallTvState && $scope.form.canWallTvState != result.canWallTvState) ||
                    ($scope.form.canDoorLockState && $scope.form.canDoorLockState != result.canDoorLockState) ||
                    ($scope.form.canBoilerState && $scope.form.canBoilerState != result.canBoilerState) ||
                    ($scope.form.canWindowScreenState && $scope.form.canWindowScreenState != result.canWindowScreenState)) {
                    $scope.engineers.count--;
                    $scope.engineers.rows.splice(index, 1);
                } else {
                    update(index, result);
                }
            } else {
                update(index, result);
            }
        }, function () {
            vm.modalOpen = false;
            console.log("cancel modal page")
        });
    }

    function update(index, result) {
        $scope.engineers.rows[index] = result;
    }
}