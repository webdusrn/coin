export default function SessionCtrl($scope, $rootScope, $location, $filter, sessionManager, errorHandler, metaManager, oauthManager) {
    "ngInject";

    var translate = $filter('translate');
    var vm = $scope.vm = {};
    $scope.pass1 = "";

    vm.login = login;
    vm.signup = signup;
    vm.findPass = findPass;
    vm.changePass = changePass;
    vm.isVisibleItem = isVisibleItem;
    vm.isLoggedIn = sessionManager.isLoggedIn;
    vm.STD = metaManager.std;
    vm.getFormError = errorHandler.getFormError;
    vm.isInvalid = errorHandler.isInvalid;
    vm.session = sessionManager.session;

    vm.goToFacebook = function () {
        location.href = '/oauth/facebook?signup=http://local.slogup.com:3001/sample/accounts/signup&redirect=http://local.slogup.com:3001/sample/boards/slug1&fail=/fail';
    };

    if (sessionManager.isLoggedIn()) {
        $location.href = "/";
    }

    vm.oauth = oauthManager;
    if (!vm.form) vm.form = {};
    vm.form.email = ((oauthManager.facebook && oauthManager.facebook.email) || (oauthManager.twitter && oauthManager.twitter.email)) || '';
    vm.form.nick = ((oauthManager.facebook && oauthManager.facebook.nick) || (oauthManager.twitter && oauthManager.twitter.nick)) || '';

    function isVisibleItem(item) {
        var enableProfileItems = metaManager.std.profile.enableProfileItems;
        for (var i = 0; i < enableProfileItems.length; ++i) {
            if (item == enableProfileItems[i]) return true;
        }
        return false;
    }

    function findPass() {
        var email = vm.form.email;
        sessionManager.sendFindPassEmail(email, function (status, data) {
            if (status == 200) {
                $rootScope.$broadcast("core.session.callback", {
                    type: 'findPass'
                });
            } else {
                errorHandler.alertError(status, data);
            }
        });
    }

    function changePass() {
        if (!$location.search() || !$location.search().token) {
            return alert(translate("wrongRequest"));
        }

        var token = $location.search().token;
        token = token.replace(/\s/g, "+");

        var pass = vm.form.newPass;
        if (!pass) {
            return alert(translate('insertPass'));
        }

        sessionManager.changePassWithToken(pass, token, function (status, data) {
            if (status == 200) {
                $rootScope.$broadcast("core.session.callback", {
                    type: 'changePass'
                });
            } else {
                errorHandler.alertError(status, data);
            }
        });
    }

    function login(form) {
        if (form.$valid) {
            sessionManager.loginWithEmail(vm.form.email, vm.form.pass, function (status, data) {
                if (status == 200) {
                    $rootScope.$broadcast("core.session.callback", {
                        type: 'login'
                    });
                } else {
                    errorHandler.alertError(status, data);
                }
            });
        } else {
            alert(translate('insertRightInfo'));
        }
    }

    function signup(form) {
        if (form.$valid) {
            var user = {
                secret: vm.form.pass,
                uid: vm.form.email,
                nick: vm.form.nick,
                agreedEmail: true,
                type: metaManager.std.user.defaultSignUpType
            };

            sessionManager.signup(user, function (status, data) {
                if (status == 201) {
                    $rootScope.$broadcast("core.session.callback", {
                        type: 'signup'
                    });
                } else {
                    errorHandler.alertError(status, data);
                }
            });
        } else {
            alert(translate('insertRightInfo'));
        }
    }
}