var path = require('path');
var appDir = require('app-root-path').path;
appDir = path.resolve(appDir, "./core/server/views/email");

var CONFIG = require('../../../../bridge/config/env');
var sgSender = require('sg-sender');
var sendNoti = sgSender.getSender(CONFIG.sender);
var emailErrorRefiner = sgSender.emailErrorRefiner;
var phoneErrorRefiner = sgSender.phoneErrorRefiner;
var STD = require('../../../../bridge/metadata/standards');

module.exports = {
    sendPush: function (token, title, body, badge, data, platform, callback) {

        if (CONFIG.sender.fcm && CONFIG.sender.fcm.key && token) {
            sendNoti.fcm(token, title, body, badge, data, platform.toLowerCase(), STD.notification.pushSound, data.key, function (err) {
                if (err) {
                    if (callback) callback(500, err);

                } else {
                    if (callback) callback(204);

                }
            });
        } else {
            if (callback) callback(404);
        }

    },
    sendEmail: function (email, title, body, callback) {
        if (sendNoti.email && email) {
            sendNoti.email(email, title, "Notification", {
                subject: title,
                dir: appDir,
                name: 'common',
                params: {
                    body: body
                }
            }, function (err) {
                if (process.env.NODE_ENV == 'test') return callback(204);
                if (err) {
                    if (callback) callback(503, emailErrorRefiner(err));

                } else {
                    if (callback) callback(204);
                }
                console.log('email error', err);
            });
        } else {
            if (callback) callback(404);
            console.log('email 404');
        }
    },
    sendSMS: function (phoneNum, title, body, callback) {
        if (sendNoti.sms && phoneNum) {
            sendNoti.sms(null, phoneNum, title, body, function (err) {
                if (err) {
                    if (callback) callback(err.status, phoneErrorRefiner(err));
                } else {
                    if (callback) callback(204);
                }
            });

        } else {
            if (callback) callback(404);
        }

    },
    sendMMS: function (phoneNum, title, body, file, callback) {
        if (sendNoti.mms && phoneNum) {
            sendNoti.mms(null, phoneNum, title, body, file, function (err) {
                if (err) {
                    if (callback) callback(err.status, phoneErrorRefiner(err));
                } else {
                    if (callback) callback(204);
                }
            });

        } else {
            if (callback) callback(404);
        }

    }
};