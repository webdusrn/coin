export default function CreateEngineerCtrl($scope, $rootScope, $uibModalInstance, VM, engineer, dialogHandler, engineerManager) {
    "ngInject";

    var vm = $scope.vm = VM;
    vm.modalOpen = true;
    $scope.cancel = cancel;

    
    $scope.updateEngineer = updateEngineer;
    $scope.changeIsUsePush = changeIsUsePush;
    $scope.deleteImage = deleteImage;

    vm.input = {};

    if (engineer) {
        $scope.engineer = engineer;

        engineerManager.getEngineerInfo({userId:$scope.engineer.id}, function(status, data){
            if(status == 200){
                vm.input = data;
                vm.input.isUsePush = true;


                vm.input.createdAt = timestampToDate(vm.input.createdAt);
                vm.engineer = engineer;

                vm.input.role = vm.engineer.role;
                

            } else {
                dialogHandler.show('', vm.translate("wrongRequest"), '', true);
            }
        });
    }


    function changeIsUsePush(){
        vm.input.isUsePush = !vm.input.isUsePush;
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



    function updateEngineer(){

        if(vm.input){
            if(vm.input.role == undefined){
                dialogHandler.show('', vm.translate("기사의 승인 여부를 선택해 주세요."), '', true);
                return;
            }
        }
        else{
            dialogHandler.show('', vm.translate("error"), '', true);
            return;
        }


        var body = {
            role: vm.input.role,
            idState: vm.input.idState,
            licenseState: vm.input.licenseState,
            boilerLicenseState: vm.input.boilerLicenseState,
            businessLicenseState: vm.input.businessLicenseState,
            constructState: vm.input.constructState,
            // state: vm.input.state,
            idImageFailMessage: vm.input.idImageFailMessage,
            profileImageFailMessage: vm.input.profileImageFailMessage,
            licenseImageFailMessage: vm.input.licenseImageFailMessage,
            boilerLicenseImageFailMessage: vm.input.boilerLicenseImageFailMessage,
            businessLicenseImageFailMessage: vm.input.businessLicenseImageFailMessage,
            constructImageFailMessage: vm.input.constructImageFailMessage,
            addressFailMessage: vm.input.addressFailMessage,
            etcFailMessage: vm.input.etcFailMessage,
            pushSwitch: vm.input.isUsePush,
            memo: vm.input.memo,

            canAirConditionerState: vm.input.canAirConditionerState,
            canDoorLockState: vm.input.canDoorLockState,
            canWallTvState: vm.input.canWallTvState,
            canWindowScreenState: vm.input.canWindowScreenState,
            canBoilerState: vm.input.canBoilerState
        };

        engineerManager.putEngineer(vm.engineer.id, body, function (status, data) {
            if (status == 204) {
                engineerManager.findEngineer({
                    id: vm.engineer.id
                }, function (status, data) {
                    if (status == 200) {
                        dialogHandler.show('', vm.translate("updateEngineer"), '', true, null, function () {
                            $uibModalInstance.close(data);
                        });
                    } else {
                        dialogHandler.alertError(status, data);
                    }
                });
            } else {
                dialogHandler.show('', data.message, '', true, null, function () {
                    cancel();
                });
            }
        });
    }

    function cancel() {
        $uibModalInstance.dismiss('cancel');
    }

    function deleteImage(type){
        dialogHandler.show('', '해당 이미지를 삭제하시겠습니까?', '삭제', false, function(){

            var body = {};
            if(type == "id"){
                body.idImage = true;
            }
            if(type == "profile"){
                body.profileImage = true;
            }
            if(type == "air"){
                body.licenseImage = true;
            }
            if(type == "business"){
                body.businessLicenseImage = true;
            }
            if (type == 'boiler') {
                body.boilerLicenseImage = true;
            }
            if (type == 'construct') {
                body.constructImage = true;
            }

            engineerManager.removeEngineerImage($scope.engineer.id, body, function(status, data){
                if(status == 204){
                    if(type == "id"){
                        vm.input.idImageId = null;
                        vm.input.idImage = null;
                    }
                    if(type == "profile"){
                        vm.input.profileImageId = null;
                        vm.input.profileImage = null;
                    }
                    if(type == "air"){
                        vm.input.licenseImageId = null;
                        vm.input.licenseImage = null;
                    }
                    if(type == "business"){
                        vm.input.businessLicenseImageId = null;
                        vm.input.businessLicenseImage = null;
                    }
                    if (type == 'boiler') {
                        vm.input.boilerLicenseImageId = null;
                        vm.input.boilerLicenseImage = null;
                    }
                    if (type == 'construct') {
                        vm.input.constructImageId = null;
                        vm.input.constructImage = null;
                    }
                    $rootScope.$broadcast('app.admin.delete-engineer-info-image', {
                        type: type
                    });
                }
                else{
                    dialogHandler.alertError(status, data);
                }
            });

        }, function () {
            console.log("close");
        });
    }
}
