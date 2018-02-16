var meta = require('../../../../bridge/metadata');
var path = require('path');
var fs = require('fs');
var json2csv = require('json2csv');
var async = require('async');

var STD = require('../../../../bridge/metadata/standards');
var CONFIG = require('../../../../bridge/config/env');
var APP_CONFIG = CONFIG.app;
var url = APP_CONFIG.rootUrl + "/" + APP_CONFIG.apiName + '/accounts/auth-email?token=';
var appDir = require('app-root-path').path;
appDir = path.resolve(appDir, "./core/server/views/email");

var sgSender = require('sg-sender');
var sendNoti = sgSender.getSender(CONFIG.sender);
var emailErrorRefiner = sgSender.emailErrorRefiner;
var phoneErrorRefiner = sgSender.phoneErrorRefiner;

var sequelize = require('../../../server/config/sequelize');
var errorHandler = require('sg-sequelize-error-handler');
var NOTIFICATION = STD.notification;
var NOTIFICATIONS = require('../../../../bridge/metadata/notifications');
var LANGUAGES = require('../../../../bridge/metadata/languages');

var changeExp = /[\r\n\s!@#$&%^*()\-=+\\\|\[\]{};:\'`"~,.<>\/?]/g;

var correctPhoneNum = new RegExp("^[+]{1}821[016789]{1}[0-9]{7,8}$");
var phoneNum1 = new RegExp("^1[016789]{1}[0-9]{7,8}$");
var phoneNum2 = new RegExp("^821[016789]{1}[0-9]{7,8}$");
var phoneNum3 = new RegExp("^8201[016789]{1}[0-9]{7,8}$");
var phoneNum4 = new RegExp("^01[016789]{1}[0-9]{7,8}$");

var notiHelper = require('./noti-helper');

function makeAuthEmailUrl(redirects, auth) {
    return url + auth.token + "&type=" + auth.type + "&successRedirect=" + (redirects.successRedirect || "") + "&errorRedirect=" + (redirects.errorRedirect || "");
}

module.exports = {
    all: {
        sendNotification: function (userId, notification, payload, callback) {
            var _this = this;
            var user;

            sequelize.models.User.findUserNotificationInfo(userId, function (status, data) {
                if (status == 200) {
                    user = data;

                    _this.createdNotificationBox(user, notification, payload, function (status, data) {

                        if (status == 204) {

                            var sendTypes = notification.sendTypes;
                            var funcs = [];

                            for (var sendType in sendTypes) {
                                (function (sendType) {
                                    funcs.push(function (subCallback) {
                                        if (!_this.isNotificationSwitchOn(user, notification.key, sendType)) {
                                            subCallback(null, false);
                                        } else {
                                            _this.replaceMagicKey(sendTypes[sendType], payload, user.language, function (isSuccess, title, body) {

                                                payload['key'] = notification.key;

                                                if (isSuccess) {

                                                    _this.getNewNotificationCount(user.id, function (isSuccess, result) {

                                                        var badge = result.newNotificationCount + result.newChatMessageCount;
                                                        payload['newNotificationCount'] = result.newNotificationCount;
                                                        payload['newChatMessageCount'] = result.newChatMessageCount;

                                                        if (isSuccess) {
                                                            _this.send(user, sendType, title, body, badge, payload, undefined, undefined, function (status, data) {
                                                                if (status == 204) {
                                                                    subCallback(null, false);
                                                                    // if (callback) callback(status, data);
                                                                } else {
                                                                    subCallback(null, false);
                                                                    // if (callback) callback(status, data);
                                                                }
                                                            });
                                                        } else {
                                                            subCallback(null, false);
                                                            // if (callback)callback(204);
                                                        }

                                                    });

                                                } else {
                                                    subCallback(null, false);
                                                    // if (callback)callback(204);
                                                }

                                            });
                                        }
                                    });
                                })(sendType);
                            }

                            async.series(funcs, function (error, results) {
                                if (callback) callback(204);
                            });


                            // for (var sendType in sendTypes) {
                            //     (function (sendType) {
                            //         if (!_this.isNotificationSwitchOn(user, notification.key, sendType)) {
                            //             return false;
                            //         }
                            //
                            //         _this.replaceMagicKey(sendTypes[sendType], payload, user.language, function (isSuccess, title, body) {
                            //
                            //             payload['key'] = notification.key;
                            //
                            //             if (isSuccess) {
                            //
                            //                 _this.getNewNotificationCount(user.id, function (isSuccess, result) {
                            //
                            //                     var badge = result.newNotificationCount + result.newChatMessageCount;
                            //                     payload['newNotificationCount'] = result.newNotificationCount;
                            //                     payload['newChatMessageCount'] = result.newChatMessageCount;
                            //
                            //                     if (isSuccess) {
                            //                         _this.send(user, sendType, title, body, badge, payload, undefined, undefined, function (status, data) {
                            //                             if (status == 204) {
                            //                                 if (callback) callback(status, data);
                            //                             } else {
                            //                                 if (callback) callback(status, data);
                            //                             }
                            //                         });
                            //                     } else {
                            //                         if (callback)callback(204);
                            //                     }
                            //
                            //                 });
                            //
                            //             } else {
                            //                 if (callback)callback(204);
                            //             }
                            //
                            //         });
                            //     })(sendType);
                            // }

                        } else {
                            if (callback) callback(204);
                        }
                    });

                } else {
                    if (callback) callback(204);
                }
            });

        },
        sendNotificationBySendType: function (notification, title, body, key, user, payload, file, sendMethod, callback) {
            var _this = this;

            _this.createdNotificationBox(user, notification, payload, function (status, data) {

                if (status == 204) {
                    if (_this.isNotificationSwitchOn(user, notification.key, key)) {

                        payload['key'] = notification.key;

                        _this.getNewNotificationCount(user.id, function (isSuccess, result) {

                            var badge = result.newNotificationCount + result.newChatMessageCount;
                            payload['newNotificationCount'] = result.newNotificationCount;
                            payload['newChatMessageCount'] = result.newChatMessageCount;

                            if (isSuccess) {
                                _this.send(user, key, title, body, badge, payload, file, sendMethod, function (status, data) {
                                    if (callback) callback(status, data);
                                });
                            } else {
                                if (callback) callback(204);
                            }

                        });

                    } else {
                        if (callback) callback(204);
                    }
                } else {
                    if (callback) callback(204);
                }
            });

        },
        createdNotificationBox: function (user, notification, payload, callback) {

            var uploadData = payload || notification.payload;
            uploadData = JSON.stringify(uploadData);

            if (notification.isStored) {
                var notificationBox = sequelize.models.NotificationBox.build({
                    userId: user.id,
                    key: notification.key,
                    payload: uploadData
                });
                notificationBox.create(function (status, data) {
                    if (status == 200) {
                        callback(204);
                    } else {
                        callback(status);
                    }
                });
            } else {
                callback(204);
            }

        },
        isNotificationSwitchOn: function (user, notificationKey, sendType) {

            var notificationSwitch = user.notificationSwitches;
            for (var i = 0; i < notificationSwitch.length; ++i) {
                if (notificationSwitch[i].key == notificationKey) {
                    if (notificationSwitch[i].sendType == sendType) {
                        return false;
                    }
                }
            }

            var notificationPublicSwitch = user.notificationPublicSwitches;
            for (var i = 0; i < notificationPublicSwitch.length; ++i) {
                if (notificationSwitch[i].key == notificationKey) {
                    if (notificationPublicSwitch[i].sendType == sendType) {
                        return false;
                    }
                }
            }

            return true;

        },
        replaceMagicKey: function (sendType, payload, language, callback) {

            var localLanguage;
            var title;
            var body;

            if (LANGUAGES.hasOwnProperty(language)) {
                localLanguage = LANGUAGES[language];

                if (localLanguage.hasOwnProperty(sendType.title) && localLanguage.hasOwnProperty(sendType.body)) {

                    title = localLanguage[sendType.title];
                    body = localLanguage[sendType.body];

                    for (var key in payload) {
                        if (payload.hasOwnProperty(key)) {
                            body = body.replace(':' + key + ':', payload[key]);
                        }
                    }

                    return callback(true, title, body);
                }
            }

            return callback(false);

        },
        getNewNotificationCount: function (userId, callback) {

            var result = {};

            sequelize.models.NotificationBox.findNewNotificationCount(userId, {}, function (status, data) {
                if (status == 200) {
                    result.newNotificationCount = data;

                    sequelize.models.ChatRoomUser.getNewChatMessageCount(userId, function (status, data) {
                        if (status == 200 || status == 404) {
                            result.newChatMessageCount = data;

                            return callback(true, result);
                        } else {
                            return callback(false);
                        }
                    });

                } else {
                    return callback(false);
                }
            });

        },
        send: function (user, sendType, title, body, badge, data, file, sendMethod, callback) {

            var NOTIFICATION = STD.notification;

            if (sendType == NOTIFICATION.sendTypeEmail) {
                notiHelper.sendEmail(user.email, title, body, callback);
            } else if (sendType == NOTIFICATION.sendTypeMessage) {

                if (file) {
                    notiHelper.sendMMS(user.phoneNum, title, body, file, callback);
                } else {

                    if (sendMethod == NOTIFICATION.sendMethodMms) {
                        notiHelper.sendMMS(user.phoneNum, title, body, file, callback);
                    } else {
                        notiHelper.sendSMS(user.phoneNum, title, body, callback);
                    }
                }

            } else if (sendType == NOTIFICATION.sendTypePush) {
                sendPush(callback);
            } else {
                callback(500);
            }

            function sendPush(callback) {
                var histories = user.loginHistories;

                var funcs = [];

                if (histories.length > 0) {
                    histories.forEach(function (history) {
                        (function (history) {
                            funcs.push(function (subCallback) {
                                notiHelper.sendPush(history.token, title, body, badge, data, history.platform, function (status, data) {
                                    if (status == 204 || status == 404) {

                                    } else if (status == 404) {

                                    } else {

                                    }
                                    subCallback(null, true);
                                });
                            });
                        })(history);
                    });

                    async.series(funcs, function (err, results) {
                        callback(204);
                    });
                } else {
                    callback(404);
                }

            }
        }
    },
    email: {
        signup: function (req, redirects, auth, user, callback) {
            console.log(url + auth.token);
            var welcomeMsg = meta.langs[req.language].welcome;
            req.sendNoti.email(user.email, '', "SignUp", {
                subject: user.nick + welcomeMsg,
                dir: appDir,
                name: 'signup',
                params: {
                    nick: user.nick,
                    url: makeAuthEmailUrl(redirects, auth),
                    expiredAt: auth.expiredAt
                }
            }, function (err) {
                if (process.env.NODE_ENV == 'test') return callback(204);
                if (err) {
                    callback(503, req.emailErrorRefiner(err));
                } else {
                    callback(204);
                }
            });
        },
        findPass: function (req, redirects, auth, callback) {
            var newPassMsg = meta.langs[req.language].newPassExplain;
            req.sendNoti.email(auth.key, '', "FindPass", {
                subject: newPassMsg,
                dir: appDir,
                name: 'find-pass',
                params: {
                    url: makeAuthEmailUrl(redirects, auth) + "&email=" + auth.key,
                    expiredAt: auth.expiredAt
                }
            }, function (err) {
                if (process.env.NODE_ENV == 'test') return callback(204);
                if (err) {
                    callback(503, req.emailErrorRefiner(err));
                } else {
                    callback(204);
                }
            });
        },
        adding: function (req, redirects, auth, callback) {
            console.log(url + auth.token);
            var addingMsg = meta.langs[req.language].adding;
            req.sendNoti.email(auth.key, '', "Adding", {
                subject: addingMsg,
                dir: appDir,
                name: 'adding',
                params: {
                    url: makeAuthEmailUrl(redirects, auth),
                    expiredAt: auth.expiredAt
                }
            }, function (err) {
                if (process.env.NODE_ENV == 'test') return callback(204);
                if (err) {
                    callback(503, req.emailErrorRefiner(err));
                } else {
                    callback(204);
                }
            });
        },
        findId: function (req, redirects, user, callback) {
            var findIdTitleMsg = meta.langs[req.language].findIdTitleExplain;
            req.sendNoti.email(user.email, '', "FindId", {
                subject: findIdTitleMsg,
                dir: appDir,
                name: 'find-id',
                params: {
                    userId: user.aid
                }
            }, function (err) {
                if (process.env.NODE_ENV == 'test') return callback(204);
                if (err) {
                    callback(503, req.emailErrorRefiner(err));
                } else {
                    callback(204);
                }
            });
        }
    },
    sms: {
        sendAuth: function (req, phoneNum, token, callback) {
            var MAGIC = req.meta.std.magic;
            var lang = req.meta.langs[req.language];
            var msg = lang.smsAuthExplain;
            var min = req.meta.std.user.expiredPhoneTokenMinutes;
            msg = msg.replace(MAGIC.authNum, token);
            msg = msg.replace(MAGIC.minute, min);
            console.log(phoneNum, token, msg);
            if (req.sendNoti.sms) {
                req.sendNoti.sms(null, phoneNum, '', msg, function (err) {
                    if (err) {
                        callback(err.status, req.phoneErrorRefiner(err));
                    } else {
                        callback(204);
                    }
                });
            }
            else {
                callback(204);
            }
        },
        newPass: function (req, phoneNum, pass, callback) {
            var MAGIC = req.meta.std.magic;
            var lang = req.meta.langs[req.language];
            var msg = lang.findPassExplain;
            msg = msg.replace(MAGIC.pass, pass);
            console.log(phoneNum, msg);
            if (req.sendNoti.sms) {
                req.sendNoti.sms(null, phoneNum, '', msg, function (err) {
                    if (err) {
                        callback(err.status, req.phoneErrorRefiner(err));
                    } else {
                        callback(204);
                    }
                });
            }
            else {
                callback(204);
            }
        }
    },
    massNotification: {
        sendAll: function (req, array, file, callback) {
            var _this = this;

            var LOCAL = req.meta.std.local;
            var FILE = req.meta.std.file;
            var failArray = [];
            var funcs = [];
            var messageFilePath = LOCAL.uploadUrl + '/' + FILE.folderEtc + '/' + FILE.folderMessage + '/' + req.massNotification.id + '.csv';

            for (var i = 0; i < array.length; i++) {
                (function (currentTime) {
                    funcs.push(function (subCallback) {

                        switch (array[currentTime].sendType) {
                            case NOTIFICATION.sendTypeMessage:

                                _this.message.sendMessage(req, array[currentTime].dest, array[currentTime].message, function (status, data) {
                                    if (status == 200) {
                                        try {
                                            var message = array[currentTime].dest + ',' + JSON.parse(data).cmid;
                                            fs.appendFile('./' + messageFilePath, message, function (err) {
                                                if (err) {
                                                    console.log(err);
                                                }
                                            });
                                        } catch (err) {

                                        }
                                    } else if (status == 204) {
                                        /**
                                         * no send noti, no callback
                                         */
                                    } else {
                                        var errorMessage = "unexpected error";
                                        if (data instanceof Object && data.message) {
                                            errorMessage = data.message;
                                        } else if (data instanceof String) {
                                            errorMessage = data;
                                        }
                                        console.log("send message fail:", array[currentTime].dest, errorMessage);
                                        failArray.push({
                                            dest: array[currentTime].dest,
                                            errorCode: errorMessage
                                        });
                                    }
                                    subCallback(null, true);
                                }, file);

                                break;
                            case NOTIFICATION.sendTypeEmail:

                                notiHelper.sendEmail(array[currentTime].dest, array[currentTime].title, array[currentTime].message, function (status, data) {
                                    if (status == 204) {

                                    } else {
                                        var errorMessage = "unexpected error";
                                        if (data instanceof Object && data.message) {
                                            errorMessage = data.message;
                                        } else if (data instanceof String) {
                                            errorMessage = data;
                                        }
                                        console.log('send email fail:', array[currentTime].dest, errorMessage);
                                        failArray.push({
                                            dest: array[currentTime].dest,
                                            errorCode: errorMessage
                                        });
                                    }
                                    subCallback(null, true);
                                });

                                break;
                            case NOTIFICATION.sendTypePush:

                                notiHelper.sendPush(array[currentTime].dest, array[currentTime].title, array[currentTime].message, badge, {}, array[currentTime].platform, function (status, data) {
                                    if (status == 204) {

                                    } else {
                                        // var errorMessage = "unexpected error";
                                        // if (data instanceof Object && data.message) {
                                        //     errorMessage = data.message;
                                        // } else if (data instanceof String) {
                                        //     errorMessage = data;
                                        // }
                                        // console.log('send push fail:', array[currentTime].dest, errorMessage);
                                        // failArray.push({
                                        //     dest: array[currentTime].dest,
                                        //     errorCode: errorMessage
                                        // });

                                        console.log('send push fail:', array[currentTime].dest);
                                    }
                                    subCallback(null, true);
                                });

                                break;
                        }


                    });
                })(i);
            }

            async.series(funcs, function (errorCode, results) {
                callback(failArray);
            });
        },
        parse: {
            message: function (phoneNum) {
                var temp = phoneNum + '';
                temp = temp.replace(changeExp, '');

                if (phoneNum1.test(temp)) {
                    temp = '+82' + temp;
                }

                if (phoneNum2.test(temp)) {
                    temp = temp.replace('82', '+82');
                }

                if (phoneNum3.test(temp)) {
                    temp = temp.replace('820', '+82');
                }

                if (phoneNum4.test(temp)) {
                    temp = temp.replace('01', '+821');
                }

                if (correctPhoneNum.test(temp)) {
                    return temp;
                } else {
                    return STD.notification.wrongPhoneNum;
                }
            },
            email: function (email) {
                return email;
            },
            token: function (token) {
                return token;
            }
        },
        message: {
            sendMessage: function (req, phoneNum, message, callback, file) {
                var _this = this;
                var from = null;

                // if (req.user.phoneNum) {
                //     from = req.user.phoneNum;
                // }

                if (req.body.sendMethod == req.meta.std.notification.sendMethodMms) {
                    _this.sendMms(req, from, phoneNum, message, file, callback);
                } else {
                    _this.sendSms(req, from, phoneNum, message, callback);
                }
            },
            sendMms: function (req, from, phoneNum, message, file, callback) {
                if (req.sendNoti.mms) {
                    var title = '';
                    if (req.body.mmsTitle !== undefined) {
                        title = req.body.mmsTitle;
                    }
                    req.sendNoti.mms(from, phoneNum, title, message, file, function (err, body) {
                        if (err) {
                            callback(err.status, req.phoneErrorRefiner(err));
                        } else {
                            callback(200, body);
                        }
                    });
                } else {
                    callback(204);
                }
            },
            sendSms: function (req, from, phoneNum, message, callback) {
                if (req.sendNoti.sms) {
                    var title = '';
                    if (req.body.mmsTitle !== undefined) {
                        title = req.body.mmsTitle;
                    }
                    req.sendNoti.sms(from, phoneNum, title, message, function (err, body) {
                        if (err) {
                            callback(err.status, req.phoneErrorRefiner(err));
                        } else {
                            callback(200, body);
                        }
                    });
                } else {
                    callback(204);
                }
            }
        },
        import: {
            writeSplitFile: function (data, currentTime, field, splitFilePath, successCallback, failCallback) {
                json2csv({
                    data: data,
                    field: field
                }, function (err, csvString) {
                    if (err) {
                        if (failCallback) {
                            failCallback('400_69');
                        }
                    } else {
                        fs.writeFile('./' + splitFilePath, csvString, function (err) {
                            if (err) {
                                if (failCallback) {
                                    failCallback('400_70');
                                }
                            } else {
                                if (successCallback) {
                                    successCallback();
                                }
                            }
                        });
                    }
                });
            },
        }
    }
};