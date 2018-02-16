export default function ReportsCtrl ($scope, reportsManager, errorHandler, metaManager) {
    "ngInject";

    var vm = null;
    if ($scope.vm !== undefined) {
        vm = $scope.vm;
    } else {
        vm = $scope.vm = {};
    }

    vm.form = {};
    vm.reportList = [];
    vm.STATE = {
        DONE: "DONE",
        LOADING: "LOADING",
        MORE: "MORE"
    };
    vm.currentState = vm.STATE.DONE;

    vm.createReport = createReport;
    vm.findReports = findReports;

    findReports(true);

    function createReport () {
        var body = angular.copy(vm.form);
        if (vm.session && vm.session.id) {
            if (vm.session.nick) {
                body.nick = angular.copy(vm.session.nick);
            }
            if (vm.session.email) {
                body.email = angular.copy(vm.session.email);
            }
        }
        if (!body.body) {
            return false;
        }
        reportsManager.createReport(body, function (status, data) {
            if (status == 201) {
                vm.reportList.unshift(data);
                vm.form = {};
            } else {
                errorHandler.alertError(status, data);
            }
        });
    }

    function findReports (refresh) {
        if (vm.session && vm.session.id) {
            var last = null;
            if (refresh) {
                vm.reportList = [];
            } else {
                if (vm.reportList.length > 0) last = vm.reportList[vm.reportList.length - 1].createdAt;
            }
            var query = {};
            if (vm.form.searchItem) query.searchItem = vm.form.searchItem;
            if (vm.form.searchField) query.searchField = vm.form.searchField;
            if (vm.form.size) query.searchField = vm.form.size;
            if (vm.form.isSolved) query.searchField = vm.form.isSolved;
            if (vm.form.sort) query.searchField = vm.form.sort;
            if (last) query.last = last;
            if (vm.session.role < metaManager.std.user.roleAdmin) {
                query.authorId = vm.session.id;
            }
            vm.currentState = vm.STATE.LOADING;
            reportsManager.findReports(query, function (status, data) {
                vm.currentState = vm.STATE.MORE;
                if (status == 404) {
                    vm.currentState = vm.STATE.DONE;
                } else {
                    if (data.rows && data.rows.length > 0 && data.rows.length < metaManager.std.common.defaultLoadingLength) {
                        vm.currentState = vm.STATE.DONE;
                    }
                    vm.reportList = vm.reportList.concat(data.rows);
                }
            });
        }


    }
}