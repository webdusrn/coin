export default function DashboardInfoCtrl($scope, $rootScope, $filter, dashboardInfoManager, dialogHandler, loadingHandler, metaManager) {
    "ngInject";

    var vm = null;
    if ($scope.vm !== undefined) {
        vm = $scope.vm;
    } else {
        vm = $scope.vm = {};
    }

    var LOADING = metaManager.std.loading;
    var ADMIN = metaManager.std.admin;

    vm.FLAG = metaManager.std.flag;

    $scope.dashboardInfo = undefined;

    $scope.findDashboardInfo = findDashboardInfo;

    function findDashboardInfo() {
        loadingHandler.startLoading(LOADING.spinnerKey, 'findDashboardInfo');

        dashboardInfoManager.findDashboardInfo({}, function (status, data) {
            if (status == 200) {
                $scope.dashboardInfo = data;
                setUserChart();
                setUserAgeChart();
                setReportChart();
            } else {
                dialogHandler.alertError(status, data);
            }

            loadingHandler.endLoading(LOADING.spinnerKey, 'findDashboardInfo');
        });
    }

    function setUserChart() {
        var usersStatusByMonth = $scope.dashboardInfo.usersStatusByMonth;
        var createdUsers = usersStatusByMonth.createdUsers;
        var deletedUsers = usersStatusByMonth.deletedUsers;

        var labels = [];
        var data = [[], []];

        var key;

        for (key in createdUsers) {
            labels.unshift(createdUsers[key].month + $filter('translate')('month'));
            data[0].unshift(createdUsers[key].count);
        }

        for (key in deletedUsers) {
            data[1].unshift(deletedUsers[key].count);
        }

        $scope.userChart.labels = labels;
        $scope.userChart.data = data;
    }

    function setUserAgeChart() {

        var userAgeGroup = $scope.dashboardInfo.userAgeGroup;
        var data = [0, 0, 0, 0, 0, 0, 0];

        for (var i = 0; i < userAgeGroup.length; i++) {

            var ageGroup;

            if (userAgeGroup[i].ageGroup == null) {
                ageGroup = null;
            } else {
                ageGroup = parseInt(userAgeGroup[i].ageGroup);
            }

            var ageCount = parseInt(userAgeGroup[i].count);

            switch (ageGroup) {
                case null:
                    data[6] += ageCount;
                    break;
                case 0:
                    data[0] += ageCount;
                    break;
                case 10:
                    data[0] += ageCount;
                    break;
                case 20:
                    data[1] += ageCount;
                    break;
                case 30:
                    data[2] += ageCount;
                    break;
                case 40:
                    data[3] += ageCount;
                    break;
                case 50:
                    data[4] += ageCount;
                    break;
                default:
                    data[5] += ageCount;
                    break;
            }
        }

        $scope.userAgeChart.data = data;
    }

    function setReportChart() {
        var reportsStatusByMonth = $scope.dashboardInfo.reportsStatusByMonth;
        var createdReports = reportsStatusByMonth.createdReports;
        var solvedReports = reportsStatusByMonth.solvedReports;

        var labels = [];
        var data = [[], []];

        var key;

        for (key in createdReports) {
            labels.unshift(createdReports[key].month + $filter('translate')('month'));
            data[0].unshift(createdReports[key].count);
        }

        for (key in solvedReports) {
            data[1].unshift(solvedReports[key].count);
        }

        $scope.reportChart.labels = labels;
        $scope.reportChart.data = data;
    }

    $scope.loginChart = {
        labels: ["5월", "6월", "7월", "8월", "9월", "10월", "11월"],
        series: ['로그인수', '회원수'],
        data: [
            [65, 59, 80, 81, 56, 55, 40],
            [28, 48, 40, 19, 86, 27, 90]
        ],
        onClick: function (points, evt) {
            console.log(points, evt);
        },
        datasetOverride: [{yAxisID: 'y-axis-1'}],
        options: {
            scales: {
                yAxes: [
                    {
                        id: 'y-axis-1',
                        type: 'linear',
                        display: true,
                        position: 'left'
                    }
                ]
            }
        },
        colors: ["#6d8fe4", "#dcdcdc"]
    };

    $scope.userAgeChart = {
        labels: ["10대", "20대", "30대", "40대", "50대", "60대 이상", "미입력"],
        data: [0, 0, 0, 0, 0, 0],
        colors: ["#dae1f1", "#6d8fe4", "#62bbdb", "#6be1cf", "#b4ff91", "#f6ff6d", "#ff9d9d"],
        options: {
            responsive: true,
            maintainAspectRatio: true
        }
    };

    $scope.userGenderByAgeChart = {
        labels: ["10대", "20대", "30대", "40대", "50대", "60대 이상"],
        data: [[65, 59, 80, 81, 56, 55], [65, 59, 80, 81, 56, 55]],
        series: ["여성", "남성"],
        colors: ["#ff9d9d", "#a6c0ff"]
    };

    $scope.userChart = {
        labels: ["5월", "6월", "7월", "8월", "9월", "10월", "11월"],
        series: ['가입자', '탈퇴자'],
        data: [
            // [65, 59, 80, 81, 56, 55, 40],
            // [28, 48, 40, 19, 86, 27, 90]
        ],
        onClick: function (points, evt) {
            console.log(points, evt);
        },
        datasetOverride: [{yAxisID: 'y-axis-1'}],
        options: {
            scales: {
                yAxes: [
                    {
                        id: 'y-axis-1',
                        type: 'linear',
                        display: true,
                        position: 'left'
                    }
                ]
            }
        },
        colors: ["#dcdcdc;",
            "#ff8f8f;"]
    };


    $scope.reportChart = {
        labels: ["5월", "6월", "7월", "8월", "9월", "10월", "11월"],
        series: ['문의수', '답변수'],
        data: [
            // [80, 60, 80, 81, 40, 30, 66],
            // [55, 58, 40, 50, 45, 22, 48]
        ],
        datasetOverride: [{yAxisID: 'y-axis-1'}],
        options: {
            scales: {
                yAxes: [
                    {
                        id: 'y-axis-1',
                        type: 'linear',
                        display: true,
                        position: 'left'
                    }
                ]
            }
        },
        colors: ["#dcdcdc;",
            "#41b1a0;"]
    };

    findDashboardInfo();

    $rootScope.$broadcast(ADMIN.kNavigation, {
        activeNav: ADMIN.moduleDashboardInfo
    });

}