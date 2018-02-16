export default function adminUserCtrl ($scope, errorHandler, loadingHandler, dialogHandler, userManager, $uibModal) {
    "ngInject";

    var vm = $scope.vm;

    vm.activeNav = 'user';



    $scope.userList = [];
    $scope.lastId = 0;
    $scope.checkFalse = 0;

    vm.input = {};
    $scope.params = {
        searchItem: ''
    };





    $scope.findUsers = findUsers;

    $scope.userEstimationInfo = userEstimationInfo;


    findUsers();

    function findUsers(lastId){
        var body = {
            role: vm.USER.roleUser,
            size: 12
        };

        if(lastId){
            body.last = lastId;
        }

        if($scope.params.searchItem != undefined){
            if(lastId == undefined){
                $scope.userList = [];
            }
            body.searchField = 'phoneNum';
            body.searchItem = $scope.params.searchItem;
        }


        loadingHandler.startLoading(vm.LOADING.spinnerKey, "findConsult");
        userManager.findUsers(body, function (status, data) {
            if (status == 200) {

                $scope.count = data.count;
                var rows = data.rows;

                $scope.userList = $scope.userList.concat(rows);
                if(data.rows.length == 12){
                    $scope.lastId = rows[rows.length -1].createdAt;
                }
                else{
                    $scope.lastId = 0;
                }

            } else {
                if( status == 404){
                    $scope.lastId = 0;
                }
                else{
                    dialogHandler.alertError(status, data);
                }

            }
            loadingHandler.endLoading(vm.LOADING.spinnerKey, "findConsult");
        });
    }



    function userEstimationInfo (size, user) {

        var createInstance = $uibModal.open({
            animation: false,
            backdrop: 'static',
            templateUrl: 'myUserEstimationInfo.html',
            controller: 'userEstimationsInfoCtrl',
            backdrop: true,
            size: size,
            resolve: {
                VM: function () {
                    return vm;
                },
                user: function () {
                    return user;
                }
            }
        });

        createInstance.result.then(function (result) {

            vm.modalOpen = false;

        }, function () {
            vm.modalOpen = false;
            console.log("cancel modal page")
        });
    }

}