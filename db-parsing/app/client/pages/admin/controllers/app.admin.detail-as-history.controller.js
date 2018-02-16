export default function DetailAsHistoryCtrl ($scope, $rootScope, $filter, $timeout, $uibModalInstance, VM, asHistory, asHistoriesManager, dialogHandler, metaManager, userManager) {
    'ngInject';

    var vm = $scope.vm = VM;
    var AS_HISTORY = metaManager.std.asHistory;
    var now = new Date();
    var attachZero = $filter('attachZero');
    var timeoutInstance = null;

    vm.modalOpen = true;

    $scope.updateStandby = updateStandby;
    $scope.updateCallState = updateCallState;
    $scope.updateBookVisit = updateBookVisit;
    $scope.updateComplete = updateComplete;
    $scope.cancel = cancel;

    $scope.todayZero = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    $scope.AS_HISTORY = AS_HISTORY;
    $scope.asHistory = null;
    $scope.form = {
        // visitYear: (now.getFullYear()).toString(),
        // visitMonth: (now.getMonth() + 1).toString(),
        // visitDate: (now.getDate()).toString(),
        // visitHour: (now.getHours()).toString(),
        // visitMinutes: (now.getMinutes()).toString()
    };
    $scope.enumYears = [now.getFullYear(), now.getFullYear() + 1];
    $scope.enumMonths = [];
    for (var i=0; i<12; i++) {
        $scope.enumMonths.push(i + 1);
    }
    $scope.enumDates = [];
    generateEnumDates(now);
    $scope.enumHours = [];
    for (var i=0; i<24; i++) {
        $scope.enumHours.push(i);
    }
    $scope.enumMinutes = [];
    for (var i=0; i<60; i++) {
        $scope.enumMinutes.push(i);
    }

    $scope.$watch('form.visitYear', function (n, o) {
        if (n != o) {
            generateCurrentEnumDates();
        }
    }, true);

    $scope.$watch('form.visitMonth', function (n, o) {
        if (n != o) {
            generateCurrentEnumDates();
        }
    }, true);

    $scope.$watch('form.engineerId', function (n, o) {
        if (n != o) {
            findEngineer();
        }
    }, true);

    if (asHistory) {
        reloadAsHistory(asHistory);
    }

    function updateStandby () {
        var body = {
            id: asHistory.id,
            asState: AS_HISTORY.asStateStandby
        };
        updateAsHistory(body);
    }

    function updateCallState (isCallComplete) {
        var body = {
            id: asHistory.id,
            asCallState: isCallComplete ? AS_HISTORY.asCallStateComplete : AS_HISTORY.asCallStateStandby
        };
        updateAsHistory(body);
    }

    function updateBookVisit () {
        var body = {
            id: asHistory.id,
            asState: AS_HISTORY.asStateVisitBooked,
            asCallState: AS_HISTORY.asCallStateComplete,
            engineerId: $scope.form.engineerId,
            visitDate: generateDateString()
        };
        updateAsHistory(body);
    }

    function updateComplete() {
        var body = {
            id: asHistory.id,
            asState: AS_HISTORY.asStateComplete,
            asCallState: AS_HISTORY.asCallStateComplete,
            engineerId: $scope.form.engineerId,
            // visitDate: generateDateString()
        };
        updateAsHistory(body);
    }

    function updateAsHistory (body) {
        asHistoriesManager.updateAsHistory(body, function (status, data) {
            if (status == 204) {
                reloadAsHistory(asHistory);
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function findEngineer () {
        $scope.form.engineerName = '';
        if (timeoutInstance) $timeout.cancel(timeoutInstance);
        timeoutInstance = $timeout(function () {
            userManager.findUserById($scope.form.engineerId, function (status, data) {
                if (status == 200) {
                    $scope.form.engineerName = data.name;
                }
            });
        }, 300);
    }

    function reloadAsHistory (target) {
        asHistoriesManager.findAsHistoryById(target.id, function (status, data) {
            if (status == 200) {
                $scope.asHistory = data;
                generateForm(data);
                $rootScope.$broadcast('app.admin.reload-as-history', {
                    asHistory: data
                });
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function generateForm (data) {
        var visitDate = null;
        if (data.visitDate) {
            visitDate = new Date(data.visitDate);
            $scope.form.visitYear = (visitDate.getFullYear()).toString();
            $scope.form.visitMonth = (visitDate.getMonth() + 1).toString();
            $scope.form.visitDate = (visitDate.getDate()).toString();
            $scope.form.visitHour = (visitDate.getHours()).toString();
            $scope.form.visitMinutes = (visitDate.getMinutes()).toString();
            generateEnumDates(visitDate);
        } else {
            $scope.form.visitYear = (now.getFullYear()).toString();
            $scope.form.visitMonth = (now.getMonth() + 1).toString();
            $scope.form.visitDate = (now.getDate()).toString();
            $scope.form.visitHour = (now.getHours()).toString();
            $scope.form.visitMinutes = (now.getMinutes()).toString();
            generateEnumDates(now);
        }
        $scope.form.engineerId = data.engineerId;
    }

    function generateEnumDates (date) {
        $scope.enumDates = [];
        var maxDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        for (var i=0; i<maxDate; i++) {
            $scope.enumDates.push(i + 1);
        }
        if ($scope.form.visitDate && $scope.form.visitDate > $scope.enumDates[$scope.enumDates.length - 1]) {
            $scope.form.visitDate = '1';
        }
    }

    function generateCurrentEnumDates () {
        var current = new Date(generateDateString(true));
        generateEnumDates(current);
    }

    function generateDateString (isCurrent) {
        if (isCurrent) {
            return $scope.form.visitYear + '-' + attachZero($scope.form.visitMonth) + '-' + attachZero(1) + ' ' + attachZero($scope.form.visitHour) + ':' + attachZero($scope.form.visitMinutes) + ':00';
        } else {
            return $scope.form.visitYear + '-' + attachZero($scope.form.visitMonth) + '-' + attachZero($scope.form.visitDate) + ' ' + attachZero($scope.form.visitHour) + ':' + attachZero($scope.form.visitMinutes) + ':00';
        }
    }

    function cancel() {
        $uibModalInstance.dismiss('cancel');
    }
}