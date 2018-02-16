export default function EngineerPhoneNumCtrl ($scope, metaManager, engineerPhoneNumsManager, dialogHandler) {
    'ngInject';

    var vm = $scope.vm;

    vm.activeNav = 'engineer-phone-num';

    $scope.findEngineerPhoneNums = findEngineerPhoneNums;

    $scope.enumRoles = ['noRole'].concat(metaManager.std.engineerPhoneNum.enumRoles);
    $scope.enumCategories = ['noCategory'].concat(metaManager.std.engineerPhoneNum.enumCategories);
    $scope.enumTypes = ['noType'].concat(metaManager.std.engineerPhoneNum.enumTypes);
    $scope.more = false;
    $scope.form = {
        category: 'noCategory',
        type: 'noType',
        role: 'noRole'
    };
    $scope.engineerPhonNums = {
        count: 0,
        rows: []
    };

    findEngineerPhoneNums(true);

    $scope.$watch('form.category', function (newVal, oldVal) {
        if (newVal != oldVal) {
            findEngineerPhoneNums(true);
        }
    }, true);

    $scope.$watch('form.type', function (newVal, oldVal) {
        if (newVal != oldVal) {
            findEngineerPhoneNums(true);
        }
    }, true);

    $scope.$watch('form.role', function (newVal, oldVal) {
        if (newVal != oldVal) {
            findEngineerPhoneNums(true);
        }
    }, true);

    function findEngineerPhoneNums (refresh) {
        var last = null;
        if (refresh) {
            $scope.engineerPhonNums = {
                count: 0,
                rows: []
            };
        } else {
            last = $scope.engineerPhonNums.rows[$scope.engineerPhonNums.rows.length - 1].createdAt;
        }
        var query = angular.copy($scope.form);
        if (query.category == 'noCategory') delete query.category;
        if (query.type == 'noType') delete query.type;
        if (query.role == 'noRole') delete query.role;
        if (last) query.last = last;
        engineerPhoneNumsManager.findEngineerPhoneNums(query, function (status, data) {
            if (status == 200) {
                if (refresh) {
                    $scope.engineerPhonNums = data;
                } else {
                    $scope.engineerPhonNums.rows = $scope.engineerPhonNums.rows.concat(data.rows);
                }
                $scope.more = $scope.engineerPhonNums.rows.length < $scope.engineerPhonNums.count;
            } else if (status == 404) {
                $scope.more = false;
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }
}