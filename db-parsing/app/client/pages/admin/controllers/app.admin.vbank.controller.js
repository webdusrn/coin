export default function VbankCtrl ($scope, vbanksManager, metaManager, dialogHandler) {
    'ngInject';

    var vm = $scope.vm;

    vm.activeNav = 'vbank';
    var TOTAL_SG_STATE = 'totalSgState';

    $scope.findVbanks = findVbanks;

    $scope.enumSgStates = [TOTAL_SG_STATE].concat(metaManager.std.vbank.enumSgStates);

    $scope.more = false;
    $scope.form = {
        orderBy: 'createdAt',
        sgState: TOTAL_SG_STATE
    };
    $scope.vbanks = {
        count: 0,
        rows: []
    };
    $scope.vbankAmounts = {
        standbyAmount: 0,
        readyAmount: 0,
        paidAmount: 0,
        wrongAmount: 0
    };

    findVbanks(true);

    $scope.$watch('form.sgState', function (n, o) {
        if (n != o) {
            findVbanks(true);
        }
    }, true);

    function findVbanks (refresh) {
        findAmounts();
        var last = null;
        if (refresh) {
            $scope.vbanks = {
                count: 0,
                rows: []
            };
        } else {
            last = $scope.vbanks.rows[$scope.vbanks.rows.length - 1][$scope.form.orderBy];
        }
        var query = angular.copy($scope.form);
        if (query.sgState == TOTAL_SG_STATE) delete query.sgState;
        if (last) query.last = last;
        vbanksManager.findVbanks(query, function (status, data) {
            if (status == 200) {
                generateDeletedUser(data);
                if (refresh) {
                    $scope.vbanks = data;
                } else {
                    $scope.vbanks.rows = $scope.vbanks.rows.concat(data.rows);
                }
                $scope.more = $scope.vbanks.rows.length < $scope.vbanks.count;
            } else if (status == 404) {
                $scope.more = false;
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function generateDeletedUser (data) {
        for (var i=0; i<data.rows.length; i++) {
            if (data.rows[i].user.deletedUsers.length) {
                data.rows[i].user.deletedUsers[0].data = JSON.parse(data.rows[i].user.deletedUsers[0].data);
            }
        }
    }

    function findAmounts () {
        vbanksManager.findAmounts(function (status, data) {
            if (status == 200) {
                $scope.vbankAmounts = data;
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }
}