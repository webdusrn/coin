var META = require('../../../bridge/metadata/index');
var CODES = META.codes;
var fs = require('fs');
var async = require('async');
module.exports = {
    removeAllLoginHistoriesAndSessions: function (req, userId, callback) {

        req.models.LoginHistory.removeAllLoginHistory(userId, function (status, histories) {
            if (status == 200) {
                var funcs = [];
                histories.forEach(function (item) {
                    funcs.push(function (n) {
                        var sessionId = item.session;
                        req.sessionStore.destroy(sessionId, function (err) {
                            if (err) {
                                n(err, true);
                            } else {
                                n(null, true);
                            }
                        });
                    });
                });
                async.parallel(funcs, function (err, results) {
                    if (err) {
                        callback(500);
                    } else {
                        callback(204);
                    }
                });

            } else {
                callback(status, histories);
            }
        });
    },
    logout: function (req, callback) {
        if (req.isAuthenticated()) {
            req.sequelize.models.LoginHistory.removeLoginHistory(req.sessionID, function (status, data) {
                if (status == 204) {
                    req.logout();
                    callback(204);
                } else {
                    callback(status, data);
                }
            });
        } else {
            callback(400);
        }
    }
};