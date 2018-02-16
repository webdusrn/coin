export default function sessionManager(Session, SocialSession, usersManager, metaManager, SenderEmail, Pass) {
    "ngInject";

    var currentSession = window.session || null;
    this.session = (currentSession.id && currentSession) || null;
    this.isLoggedIn = isLoggedIn;
    this.socialLogin = socialLogin;
    this.loginWithPhone = loginWithPhone;
    this.loginWithNormalId = loginWithNormalId;
    this.loginWithPhoneId = loginWithPhoneId;
    this.loginWithEmail = loginWithEmail;
    this.logout = logout;
    this.signup = signup;
    this.getSession = getSession;
    this.sendFindPassEmail = sendFindPassEmail;
    this.changePassWithToken = changePassWithToken;
    this.deleteUser = deleteUser;

    function sendFindPassEmail(email, callback) {
        var body = {
            type: metaManager.std.user.authEmailFindPass,
            email: email
        };
        var senderEmail = new SenderEmail(body);
        senderEmail.$save(function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function changePassWithToken(newPass, token, callback) {
        var where = {};
        var body = {
            'newPass': newPass,
            'token': token
        };
        Pass.update(where, body, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data);
        });
    }

    function isLoggedIn() {
        return currentSession && currentSession.id ? true : false;
    }


    function socialLogin(provider, pid, accessToken, callback) {
        var body = {
            provider: provider,
            pid: pid,
            accessToken: accessToken
        };
        var self = this;
        var socialSession = new SocialSession(body);
        socialSession.$save(function (data) {
            currentSession = self.session = data;
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function loginWithNormalId(uid, secret, callback) {
        var body = {
            type: metaManager.std.user.signUpTypeNormalId,
            uid: uid,
            secret: secret
        };
        var self = this;
        var session = new Session(body);
        session.$save(function (data) {
            currentSession = self.session = data;
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function loginWithPhoneId(uid, secret, callback) {
        var body = {
            type: metaManager.std.user.signUpTypePhoneId,
            uid: uid,
            secret: secret
        };
        var self = this;
        var session = new Session(body);
        session.$save(function (data) {
            currentSession = self.session = data;
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function loginWithPhone(phoneNumber, authNum, callback) {
        var body = {
            type: metaManager.std.user.signUpTypePhone,
            uid: phoneNumber,
            secret: authNum
        };
        var self = this;
        var session = new Session(body);
        session.$save(function (data) {
            currentSession = self.session = data;
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function loginWithEmail(email, pass, callback) {
        var body = {
            type: metaManager.std.user.signUpTypeEmail,
            uid: email,
            secret: pass
        };
        var self = this;
        var session = new Session(body);
        session.$save(function (data) {
            currentSession = self.session = data;
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function logout(callback) {
        if (currentSession && currentSession.id) {
            var self = this;
            var session = new Session(self.session);
            session.$delete(function () {
                currentSession = self.session = null;
                callback(204);
            }, function (data) {
                callback(data.status, data.data);
            });
        }
    }

    function getSession(callback) {
        var self = this;
        Session.get({}, function (data) {
            currentSession = self.session = data;
            callback(200, data);
        }, function (data) {
            currentSession = self.session = null;
            callback(data.status, data.data);
        });
    }

    function signup(body, callback) {
        var self = this;
        usersManager.signup(body, function (status, data) {
            if (status == 201) {
                currentSession = self.session = data;
            }
            callback(status, data);
        });
    }

    function deleteUser(id, callback) {
        var self = this;
        usersManager.deleteUser({id: id}, function (status, data) {
            if (status == 204) {
                currentSession = self.session = null;
            }
            callback(status, data);
        });
    }
}