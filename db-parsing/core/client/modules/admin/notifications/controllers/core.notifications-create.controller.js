export default function NotificationsCreateCtrl($scope, $timeout, $filter, $interval, $uibModalInstance, scope, params, FileUploader, uploadManager, dialogHandler) {
    "ngInject";

    var USER = scope.metaManager.std.user;
    var LOADING = scope.metaManager.std.loading;
    var COMMON = scope.metaManager.std.common;
    var FILE = scope.metaManager.std.file;
    var NOTIFICATION = scope.metaManager.std.notification;

    $scope.sendTypes = angular.copy(NOTIFICATION.enumSendTypes);

    $scope.sendTypes.forEach(function (sendType) {
        if (sendType == NOTIFICATION.sendTypeMessage) {
            $scope.isMessageOn = true;
        }
        else if (sendType == NOTIFICATION.sendTypePush) {
            $scope.isPushOn = true;
        }
        else if (sendType == NOTIFICATION.sendTypeEmail) {
            $scope.isEmailOn = true;
        }
    });

    $scope.stopProgress = null;
    $scope.progress = {
        loading: false,
        title: '',
        progress: 0
    };

    $scope.currentSendType = '';
    $scope.tempStore = {
        notificationName: '',
        message: {
            title: '',
            body: ''
        },
        email: {
            title: '',
            body: ''
        },
        push: {
            title: '',
            body: ''
        },
        condition: {
            minBirthYear: COMMON.all,
            maxBirthYear: COMMON.all
        }
    };

    $scope.messageLength = {
        sms: 90,
        lms: 2000,
        mms: 2000
    };

    $scope.messageTop = NOTIFICATION.sendMethodSms;

    $scope.currentMessageLength = 0;
    $scope.currentMessageMaxLength = $scope.messageLength.sms;

    $scope.enumGenders = angular.copy(USER.enumGenders);
    $scope.enumPhones = angular.copy(USER.enumPhones);

    $scope.enumGenders.unshift(COMMON.all);
    $scope.enumPhones.unshift(COMMON.all);

    $scope.tempStore.condition.gender = $scope.enumGenders[0];
    $scope.tempStore.condition.platform = $scope.enumPhones[0];

    $scope.images = [];
    var files = [];

    $scope.csvFiles = [];

    $scope.birthStartList = [COMMON.all];
    $scope.birthEndList = [COMMON.all];

    var startYear = 1920;
    var date = new Date();
    var yearToday = date.getFullYear();


    // $scope.form = {
    //     type: scope.noticeTypes[0],
    //     country: scope.noticeCountries[0]
    // };
    //
    // $scope.noticeTypes = NOTICE.enumNoticeTypes;
    // $scope.noticeCountries = NOTICE.enumCountries;

    $scope.changeBodyPath = changeBodyPath;
    $scope.changeSelectPath = changeSelectPath;
    $scope.next = next;
    $scope.back = back;
    $scope.sendNotificationCondition = sendNotificationCondition;
    $scope.cancel = cancel;
    $scope.resetImage = resetImage;
    $scope.deleteCsvItem = deleteCsvItem;

    var frontPath = 'modules/admin/notifications/directives/notifications-create/core.notifications-create-';
    var tailPath = '.html';

    $scope.lastPage = false;
    $scope.createBodyPath = '';
    $scope.sendTypeItem = {};
    $scope.sendTypeSelectItem = {};

    $scope.createSelectPath = '';
    $scope.massNotification = null;

    function changeBodyPath(name) {
        $scope.createBodyPath = frontPath + name + tailPath;
        $scope.sendTypeItem = {};
        $scope.sendTypeItem[name] = true;
        $scope.currentSendType = name;
    }

    function changeSelectPath(name) {
        $scope.createSelectPath = frontPath + name + tailPath;
        $scope.sendTypeSelectItem = {};
        $scope.sendTypeSelectItem[name] = true;
        $scope.currentSelectType = name;
    }

    function next() {

        if (!$scope.tempStore.notificationName) {
            return scope.dialogHandler.show('', $filter('translate')('notificationName') + '을 입력해주세요.', '', true);
        }
        if (!$scope.tempStore[$scope.currentSendType].body) {
            return scope.dialogHandler.show('', $filter('translate')('body') + '을 입력해주세요.', '', true);
        }

        if ($scope.currentSendType == NOTIFICATION.sendTypeMessage) {
            if ($scope.currentMessageLength > $scope.messageLength.lms) {
                return scope.dialogHandler.show('', '내용을 2000bytes 이내로 입력해주세요.', '', true);
            }
        }
        $scope.lastPage = true;
    }

    function back() {
        $scope.lastPage = false;
    }

    if (params) {
        $scope.tempStore.notificationName = params.notificationName;
        $scope.tempStore[params.type].title = params.title;
        $scope.tempStore[params.type].body = params.body;

        changeBodyPath(params.type);
    } else {
        changeBodyPath('message');
    }

    changeSelectPath('condition');

    function sendNotificationCondition() {

        var body = {
            sendType: $scope.currentSendType,
            notificationName: $scope.tempStore.notificationName,
            messageTitle: $scope.tempStore[$scope.currentSendType].title,
            messageBody: $scope.tempStore[$scope.currentSendType].body
        };

        if (body.sendType == NOTIFICATION.sendTypeMessage) {
            body.sendMethod = $scope.messageTop;
        }

        if ($scope.currentSelectType == 'condition') {

            body.gender = $scope.tempStore.condition.gender;
            body.platform = $scope.tempStore.condition.platform;

            if ($scope.tempStore.condition.minBirthYear) {
                body.minBirthYear = $scope.tempStore.condition.minBirthYear;
            }

            if ($scope.tempStore.condition.maxBirthYear) {
                body.maxBirthYear = $scope.tempStore.condition.maxBirthYear;
            }

            scope.loadingHandler.startLoading(LOADING.spinnerKey, 'sendNotificationCondition');
            scope.massNotificationConditionManager.sendNotificationCondition(body, files, function (status, data) {
                if (status == 201) {

                    $scope.massNotification = data;

                    setProgress($scope.massNotification.progress, '알림을 전송중입니다.');
                    $scope.stopProgress = $interval(function () {
                        getProgress();
                    }, 1000);


                } else {
                    scope.dialogHandler.alertError(status, data);
                }

                scope.loadingHandler.endLoading(LOADING.spinnerKey, 'sendNotificationCondition');
            });
        } else if ($scope.currentSelectType == 'csv') {
            scope.loadingHandler.startLoading(LOADING.spinnerKey, 'sendNotificationCsv');
            scope.massNotificationCsvManager.sendNotificationCsv(body, files.concat($scope.csvFiles), function (status, data) {
                if (status == 201) {

                    $scope.massNotification = data;

                    setProgress($scope.massNotification.progress, '알림을 전송중입니다.');
                    $scope.stopProgress = $interval(function () {
                        getProgress();
                    }, 1000);


                } else {
                    scope.dialogHandler.alertError(status, data);
                }

                scope.loadingHandler.endLoading(LOADING.spinnerKey, 'sendNotificationCsv');
            });

        }


    }

    function getProgress() {
        scope.massNotificationsManager.findMassNotificationById($scope.massNotification.id, function (status, data) {
            if (status == 200) {
                $scope.massNotification = data;
                setProgress($scope.massNotification.progress, '알림을 전송중입니다.');
                if ($scope.massNotification.progress == 100 || $scope.massNotification.errorCode != null) {
                    $uibModalInstance.close(data);
                    $interval.cancel($scope.stopProgress);
                    endProgress();
                }

            } else {
                scope.dialogHandler.alertError(status, data);
            }
        });
    }

    function setProgress(progress, title) {
        $scope.progress.loading = true;
        $scope.progress.title = title;
        $scope.progress.progress = progress;
    }

    function endProgress() {
        $scope.progress.loading = false;
    }

    function cancel() {
        $uibModalInstance.dismiss('cancel');
    }

    function setMessageTop(name) {
        $scope.messageTop = name;
        $scope.currentMessageMaxLength = $scope.messageLength[name];
    }

    function checkMessageLength(messageBody) {

        $scope.currentMessageLength = (function (s, b, i, c) {
            for (b = i = 0; c = s.charCodeAt(i++); b += c >> 11 ? 2 : c >> 7 ? 2 : 1);
            return b
        })(messageBody);

        if (files.length > 0) {
            setMessageTop(NOTIFICATION.sendMethodMms);
        } else {
            if ($scope.currentMessageLength <= $scope.messageLength.sms) {

                if ($scope.tempStore.message.title == '') {
                    setMessageTop(NOTIFICATION.sendMethodSms);
                } else {
                    setMessageTop(NOTIFICATION.sendMethodLms);
                }

                return true;
            }

            if ($scope.currentMessageLength <= $scope.messageLength.lms) {
                setMessageTop(NOTIFICATION.sendMethodLms);
                return true;
            }

            // if ($scope.currentMessageLength <= $scope.messageLength.mms) {
            //     setMessageTop(NOTIFICATION.sendMethodMms);
            //     return true;
            // }

        }
    }

    function initializeBirthSelectBox() {

        for (var i = startYear; i <= yearToday; i++) {
            $scope.birthStartList.push(i);
            $scope.birthEndList.push(i);
        }
    }

    $scope.$watch('tempStore.condition.birthStart', function (newVal, oldVal) {

        if (newVal != oldVal) {

            var initial = $scope.tempStore.condition.birthStart == COMMON.all ? startYear : parseInt($scope.tempStore.condition.birthStart);

            $scope.birthEndList = [COMMON.all];

            for (var i = initial; i <= yearToday; i++) {
                $scope.birthEndList.push(i);
            }
        }

    }, true);

    $scope.$watch('tempStore.condition.birthEnd', function (newVal, oldVal) {

        if (newVal != oldVal) {

            var length = $scope.tempStore.condition.birthEnd == COMMON.all ? yearToday : parseInt($scope.tempStore.condition.birthEnd);

            $scope.birthStartList = [COMMON.all];

            for (var i = startYear; i <= length; i++) {
                $scope.birthStartList.push(i);
            }
        }

    }, true);

    $scope.$watch('tempStore.message.body', function (newVal, oldVal) {

        if (newVal != oldVal) {

            checkMessageLength(newVal);
        }

    }, true);

    $scope.$watch('images', function (newVal, oldVal) {
        if (newVal != oldVal) {
            if (files.length > 0) {
                setMessageTop(NOTIFICATION.sendMethodMms);
            } else {
                checkMessageLength($scope.tempStore.message.body);
            }
        }
    }, true);


    $scope.uploader = new FileUploader({
        onAfterAddingAll: function (items) {
            if (items.length > 0) {
                var split = items[0]._file.name.split('.');
                var extension = split[split.length - 1];
                var size = items[0]._file.size;

                if (extension == 'jpg') {

                    if (size <= 20480) {
                        previewFile(items[0]._file);
                    } else {
                        dialogHandler.show('', '20kb 이하의 이미지만 올려주세요.', '', true);
                    }

                } else {
                    dialogHandler.show('', 'jpg 이미지만 올려주세요.', '', true);
                }
            }
        },
        onErrorItem: function (err) {
            console.log(err);
        }
    });

    function previewFile(image) {
        files.push(image);
        var file = image;
        var reader = new FileReader();

        reader.addEventListener("load", function () {

            if ($scope.$$phase == '$apply' || $scope.$$phase == '$digest') {
                $scope.images.push(reader.result);
            } else {
                $scope.$apply(function () {
                    $scope.images.push(reader.result);
                });
            }

        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }

        // uploadManager.uploadImages($scope.images, 'common', function (status, data) {
        //     if (status == 201) {
        //         console.log(status);
        //     } else {
        //         console.log(status);
        //     }
        // });
    }

    $scope.clickUploadFile = function () {
        $timeout(function () {
            $('#uploadFile').click();
        }, 100);
    };

    function resetImage() {
        $scope.images = [];
        files = [];
    }

    function addCsv(item) {
        $scope.csvFiles.push(item);
    }

    $scope.csvUploader = new FileUploader({
        onAfterAddingAll: function (items) {

            if (items.length == 1 && $scope.csvFiles.length == 0) {
                var split = items[0]._file.name.split('.');
                var extension = split[split.length - 1];
                var size = items[0]._file.size;

                if (extension == 'csv') {

                    // if (size <= 20480) {
                    //
                    // } else {
                    //     dialogHandler.show('', '20kb 이하의 이미지만 올려주세요.', '', true);
                    // }

                    addCsv(items[0]._file);

                } else {
                    dialogHandler.show('', 'csv 파일만 올려주세요.', '', true);
                }
            } else {
                dialogHandler.show('', '한개만 업로드 가능합니다.', '', true);
            }

        },
        onErrorItem: function (err) {
            console.log(err);
        }
    });

    function deleteCsvItem(index) {
        $scope.csvFiles.splice(index, 1);
    }

    initializeBirthSelectBox();

    $scope.init = true;

}