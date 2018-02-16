export default function userEstimationsInfoCtrl($scope, $uibModalInstance, VM, user, dialogHandler, applicationManager, $uibModal) {
    "ngInject";

    var vm = $scope.vm = VM;
    vm.modalOpen = true;
    $scope.cancel = cancel;

    $scope.stateClass = stateClass;
    $scope.openApplication = openApplication;


    vm.reqEstimation = {};

    if (user) {
        $scope.user = user;

        applicationManager.findAppliaction({authorId:$scope.user.id}, function(status, data){
            if(status == 200){
                vm.reqEstimation = data.rows;
                vm.userInfo = user;
                vm.reqEstimation.createdAt = timestampToDate(vm.reqEstimation.createdAt);


            } else {
                vm.userInfo = user;
                // dialogHandler.show('', vm.translate("wrongRequest"), '', true);
            }
        });
    }



    function stateClass(index, item){
        var type = "sg-req-estimation-standby";
        if(item.state == "reqEstimationCancel"){
            return "sg-req-estimation-cancel";
        }
        for(var i=0; i<item.estimationItems.length; i++){
            if(index == i){
                if(item.estimationItems[i].estimationId == item.reqEstimationId){
                    type = "sg-req-estimation-match";
                }
                break;
            }
        }

        return type;

    }

    function timestampToDate(timestamp){
        var a = new Date(parseInt(timestamp/1000));
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = a.getFullYear();
        var month = a.getMonth()+1;
        if(month < 10){
            month = '0'+month;
        }
        var date = a.getDate();
        if(date < 10){
            date = '0'+date;
        }
        var hour = a.getHours();
        if(hour < 10){
            hour = '0'+hour;
        }
        var min = a.getMinutes();
        if(min < 10){
            min = '0'+min;
        }
        var time = year + '/' + month + '/' + date + ' ' + hour + ':' + min ;
        return time;
    }


    function cancel() {
        $uibModalInstance.dismiss('cancel');
    }

    function openApplication (size, application) {

        var createInstance = $uibModal.open({
            animation: false,
            backdrop: 'static',
            templateUrl: 'myUpdateApplication.html',
            controller: 'UpdateApplicationCtrl',
            size: size,
            resolve: {
                VM: function () {
                    return vm;
                },
                application: function () {
                    return application;
                }
            }
        });

        createInstance.result.then(function () {
        }, function () {
            console.log("cancel modal page")
        });

    }



}
