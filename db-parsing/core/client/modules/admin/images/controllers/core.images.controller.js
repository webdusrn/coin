export default function ImagesCtrl($scope, $rootScope, $filter, imagesManager, dialogHandler, loadingHandler, metaManager) {
    "ngInject";

    var vm = null;
    if ($scope.vm !== undefined) {
        vm = $scope.vm;
    } else {
        vm = $scope.vm = {};
    }

    vm.CDN = metaManager.std.cdn;
    var LOADING = metaManager.std.loading;
    var COMMON = metaManager.std.common;
    var IMAGE = metaManager.std.image;
    var ADMIN = metaManager.std.admin;
    vm.FLAG = metaManager.std.flag;

    $scope.form = {};
    $scope.imageList = [];
    $scope.imageListTotal = 0;

    $scope.imageFolders = angular.copy(metaManager.std.file.enumImageFolders);
    $scope.imageFolders.unshift(COMMON.all);
    $scope.form.folder = $scope.imageFolders[0];

    $scope.enumAuthorized = angular.copy(IMAGE.enumAuthorized);
    $scope.enumAuthorized.unshift(COMMON.all);
    $scope.isAuthorized = $scope.enumAuthorized[0];

    $scope.enumSearchFields = IMAGE.enumSearchFields;
    $scope.enumSearchFieldsUser = angular.copy(IMAGE.enumSearchFieldsUser);
    $scope.enumSearchFields = $scope.enumSearchFields.concat($scope.enumSearchFieldsUser);

    $scope.enumSearchFieldsUser.unshift(COMMON.all);
    $scope.form.searchFieldUser = $scope.enumSearchFieldsUser[0];

    $scope.isImageDetailVisible = false;
    $scope.currentImage;

    $scope.more = false;

    function parseSearchItem(body) {

        for (var i = 0; i < $scope.enumSearchFieldsUser.length; i++) {
            if ($scope.enumSearchFieldsUser[i] == body.searchField) {
                body.searchFieldUser = body.searchField;
                body.searchItemUser = body.searchItem;
                delete body.searchField;
                delete body.searchItem;
            }
        }

        return body;
    }

    $scope.showImageDetail = function (image) {
        $scope.isImageDetailVisible = true;
        $scope.currentImage = image;
    };

    $scope.hideImageDetail = function () {
        $scope.isImageDetailVisible = false;
    };

    $scope.toggleImageAuthorization = function (index) {
        var image = $scope.imageList[index];

        var body = {
            authorized: image.authorized ? false : true
        };

        loadingHandler.startLoading(LOADING.spinnerKey, 'updateImageById');
        imagesManager.updateImageById(image.id, body, function (status, data) {
            if (status == 200) {
                $scope.imageList[index] = data;

                if ($scope.isAuthorized == IMAGE.authorized && body.authorized == false) {
                    $scope.imageList.splice(index, 1);
                }

                if ($scope.isAuthorized == IMAGE.unauthorized && body.authorized == true) {
                    $scope.imageList.splice(index, 1);
                }
            } else {
                dialogHandler.alertError(status, data);
            }
            loadingHandler.endLoading(LOADING.spinnerKey, 'updateImageById');
        });
    };

    $scope.deleteImage = function ($index) {
        var image = $scope.imageList[$index];

        dialogHandler.show('', $filter('translate')('sureDelete'), '삭제', true, function () {
            loadingHandler.startLoading(LOADING.spinnerKey, 'deleteImage');
            imagesManager.deleteImage(image, function (status, data) {
                if (status == 204) {
                    $scope.imageList.splice($index, 1);
                } else {
                    dialogHandler.alertError(status, data);
                }
                loadingHandler.endLoading(LOADING.spinnerKey, 'deleteImage');
            });
        });

    };

    function toBooleanIsAuthorized() {
        if ($scope.isAuthorized == $scope.enumAuthorized[0]) {
            $scope.form.authorized = undefined;
        } else if ($scope.isAuthorized == $scope.enumAuthorized[1]) {
            $scope.form.authorized = true;
        } else if ($scope.isAuthorized == $scope.enumAuthorized[2]) {
            $scope.form.authorized = false;
        }
    }

    $scope.findImages = function () {

        $scope.imageListTotal = 0;
        $scope.imageList = [];

        $scope.form.last = undefined;

        toBooleanIsAuthorized();

        var body = angular.copy($scope.form);
        body = parseSearchItem(body);
        body.size = 30;
        loadingHandler.startLoading(LOADING.spinnerKey, 'findImages');
        imagesManager.findImages(body, function (status, data) {
            if (status == 200) {
                $scope.imageListTotal = data.count;
                $scope.imageList = $scope.imageList.concat(data.rows);
                $scope.more = $scope.imageListTotal > $scope.imageList.length;
            } else if (status == 404) {
                $scope.more = false;
            } else {
                dialogHandler.alertError(status, data);
            }

            loadingHandler.endLoading(LOADING.spinnerKey, 'findImages');
        });
    };

    $scope.findImagesMore = function () {

        if ($scope.imageList.length > 0) {
            $scope.form.last = $scope.imageList[$scope.imageList.length - 1].createdAt;
        }

        toBooleanIsAuthorized();

        var body = angular.copy($scope.form);
        body = parseSearchItem(body);

        loadingHandler.startLoading(LOADING.spinnerKey, 'findImagesMore');
        imagesManager.findImages(body, function (status, data) {
            if (status == 200) {
                $scope.imageList = $scope.imageList.concat(data.rows);
                $scope.more = $scope.imageListTotal > $scope.imageList.length;
            } else if (status == 404) {
                $scope.more = false;
            } else {
                dialogHandler.alertError(status, data);
            }

            loadingHandler.endLoading(LOADING.spinnerKey, 'findImagesMore');
        });
    };

    $scope.findImages();

    $scope.$watch('form.folder', function (newVal, oldVal) {
        if (newVal != oldVal) {
            $scope.findImages();
        }
    }, true);

    $scope.$watch('isAuthorized', function (newVal, oldVal) {
        if (newVal != oldVal) {
            $scope.findImages();
        }
    }, true);

    $scope.$on("app.image.callback", function (event, args) {
        if (args.type == 'delete') {
            $scope.imageList.splice($scope.imageList.indexOf(args.data), 1);
        }
    });

    $rootScope.$broadcast(ADMIN.kNavigation, {
        activeNav: ADMIN.moduleImages
    });
}