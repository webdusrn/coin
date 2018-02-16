export default function AdminCtrl($scope, $location, $filter, $state, navigator, uploadManager, metaManager, FileUploader, sessionManager, dialogHandler, loadingHandler) {
    "ngInject";

    var vm = $scope.vm = {};
    loadingHandler.init(vm);
    dialogHandler.init(vm);
    vm.LOADING = metaManager.std.loading;
    vm.COMMON = metaManager.std.common;
    vm.FILE = metaManager.std.file;
    vm.CDN = metaManager.std.cdn;
    vm.ROOT_URL = vm.CDN.rootUrl;
    vm.COMMAND = metaManager.std.command;

    vm.session = sessionManager.session;
    vm.USER = metaManager.std.user;
    vm.navigator = navigator;
    vm.ENGINEERINFO = metaManager.std.engineerInfo;
    vm.REQ_ESTIMATION = metaManager.std.reqEstimation;
    vm.ADDRESS = metaManager.std.addressFields;
    vm.uploadImage = uploadImage;
    vm.returnImageSrc = returnImageSrc;

    vm.translate = $filter('translate');
    vm.oauth = null;
    vm.sending = null;

    if (vm.session && vm.session.role == vm.USER.roleSupervisor) {

    } else {
        navigator.goToLogin();
    }

    FileUploader.FileSelect.prototype.isEmptyAfterSelection = function () {
        return true;
    };
    vm.FileUploader = FileUploader;

    function uploadImage(files, folder, callback) {
        uploadManager.uploadImages(files, folder, function (status, data) {
            if (status == 201) {
                callback(data);
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    $scope.$on('core.alert-dialog.callback', function (event, args) {
        var type = args.type;

        if (type == "401") {
            navigator.goToLogin();
        }

        if (type == "403_20") {
            dialogHandler.show('', '약관동의 페이지', '', true);
        }
    });

    function returnImageSrc(data) {
        if (data) {
            return vm.ROOT_URL + '/' + vm.FILE.folderImages + '/' + data.folder + '/' + data.dateFolder + '/' + data.name;
        } else {
            return "/pages/admin/assets/images/img_nologo_150_2x.png";
        }
    }

    $scope.$on("$locationChangeSuccess", function (e, next, current) {
        if (!vm.session || !vm.session.id || vm.session.role != vm.USER.roleSupervisor) {
            navigator.goToLogin();
        }
    });
}