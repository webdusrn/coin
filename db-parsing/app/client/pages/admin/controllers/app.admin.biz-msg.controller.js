export default function BizMsgCtrl ($scope, metaManager, bizMsgManager, dialogHandler) {
    'ngInject';

    var vm = $scope.vm;

    vm.activeNav = 'biz-msg';

    $scope.replace = replace;
    $scope.send = send;

    var msgItems = metaManager.std.bizMsg.msgItem;
    $scope.enumKeys = Object.keys(msgItems);
    $scope.form = {};

    $scope.type = '';

    $scope.template = '';
    $scope.replaceTemplate = '';

    $scope.reBody = '';
    $scope.replaceReBody = '';

    $scope.url_pc = '';
    $scope.replace_url_pc = '';

    $scope.url_mobile = '';
    $scope.replace_url_mobile = '';

    $scope.scheme_android = '';
    $scope.replace_scheme_android = '';

    $scope.scheme_ios = '';
    $scope.replace_scheme_ios = '';

    $scope.magicKeys = {};

    $scope.$watch('form.key', function (n, o) {
        if (n != o && n) {
            var template = msgItems[n].template;
            var reBody = msgItems[n].reBody;

            $scope.type = msgItems[n].type;

            $scope.template = template;
            $scope.replaceTemplate = template;
            $scope.reBody = reBody;
            $scope.replaceReBody = reBody;

            if ($scope.type == 'WL') {
                $scope.scheme_android = '';
                $scope.replace_scheme_android = '';
                $scope.scheme_ios = '';
                $scope.replace_scheme_ios = '';

                var url_pc = msgItems[n].url_pc;
                var url_mobile = msgItems[n].url_mobile;
                $scope.url_pc = url_pc;
                $scope.replace_url_pc = url_pc;
                $scope.url_mobile = url_mobile;
                $scope.replace_url_mobile = url_mobile;
            } else if ($scope.type == 'AL') {
                $scope.url_pc = '';
                $scope.replace_url_pc = '';
                $scope.url_mobile = '';
                $scope.replace_url_mobile = '';

                var scheme_android = msgItems[n].scheme_android;
                var scheme_ios = msgItems[n].scheme_ios;
                $scope.scheme_android = scheme_android;
                $scope.replace_scheme_android = scheme_android;
                $scope.scheme_ios = scheme_ios;
                $scope.replace_scheme_ios = scheme_ios;
            }

            $scope.magicKeys = {};

            template = template.split('#{');
            template.forEach(function (magicKey, index) {
                if (index) {
                    var key = magicKey.split('}')[0];
                    if (key) {
                        $scope.magicKeys[key] = '';
                    }
                }
            });
            reBody = reBody.split('#{');
            reBody.forEach(function (magicKey, index) {
                if (index) {
                    var key = magicKey.split('}')[0];
                    if (key) {
                        $scope.magicKeys[key] = '';
                    }
                }
            });
            if ($scope.type == 'WL') {
                url_pc = url_pc.split('#{');
                url_pc.forEach(function (magicKey, index) {
                    if (index) {
                        var key = magicKey.split('}')[0];
                        if (key) {
                            $scope.magicKeys[key] = '';
                        }
                    }
                });
            } else if ($scope.type == 'AL') {
                scheme_android = scheme_android.split('#{');
                scheme_android.forEach(function (magicKey, index) {
                    if (index) {
                        var key = magicKey.split('}')[0];
                        if (key) {
                            $scope.magicKeys[key] = '';
                        }
                    }
                });
            }
        }
    }, true);

    function replace () {
        $scope.replaceTemplate = $scope.template;
        $scope.replaceReBody = $scope.reBody;
        $scope.replace_url_pc = $scope.url_pc;
        $scope.replace_url_mobile = $scope.url_mobile;
        $scope.replace_scheme_android = $scope.scheme_android;
        $scope.replace_scheme_ios = $scope.scheme_ios;

        Object.keys($scope.magicKeys).forEach(function (magicKey) {
            if ($scope.magicKeys[magicKey]) {
                $scope.replaceTemplate = $scope.replaceTemplate.replace('#{' + magicKey + '}', $scope.magicKeys[magicKey]);
                $scope.replaceReBody = $scope.replaceReBody.replace('#{' + magicKey + '}', $scope.magicKeys[magicKey]);
                $scope.replace_url_pc = $scope.replace_url_pc.replace('#{' + magicKey + '}', $scope.magicKeys[magicKey]);
                $scope.replace_url_mobile = $scope.replace_url_mobile.replace('#{' + magicKey + '}', $scope.magicKeys[magicKey]);
                $scope.replace_scheme_android = $scope.replace_scheme_android.replace('#{' + magicKey + '}', $scope.magicKeys[magicKey]);
                $scope.replace_scheme_ios = $scope.replace_scheme_ios.replace('#{' + magicKey + '}', $scope.magicKeys[magicKey]);
            }
        });
    }

    function send () {
        bizMsgManager.send({
            key: $scope.form.key,
            phoneNum: $scope.form.phoneNum,
            payload: JSON.stringify($scope.magicKeys)
        }, function (status, data) {
            if (status == 204) {
                console.log("success");
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }
}