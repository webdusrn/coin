var async = require('async');
var sequelize = require('../../config/sequelize');

// var validateManager = require('./validateManager');
// var coreUtils = require('../utils');
var STD = require('../../../../bridge/metadata/standards');
// var NOTIFICATIONS = require('../../../bridge/metadata/notifications');
// var errorHandler = require('sg-sequelize-error-handler');

var middles = {
    validateJoinRoom: function () {
        return function (io, socket, body, next) {
            if (body && body.roomId) {
                next();
            } else {
                socket.emit(STD.chat.serverRequestFail, 400, {
                    code: '400_14'
                });
            }
        }
    },
    joinRoom: function () {
        return function (io, socket, payload, next) {

            var roomId = payload.roomId;

            var body = {
                socketId: socket.id,
                roomId: roomId,
                name: payload.name,
                type: 'join'
            };

            sequelize.models.NoSessionChatRoomUser.createNoSessionChatRoomUser(body, function (status, data) {

                if (status == 200) {
                    socket.join(roomId);

                    socket.emit(STD.chat.serverJoinRoom, {
                        chatRoomUsers: data.chatRoomUsers,
                        chatHistories: data.chatHistories
                    });
                    socket.broadcast.to(roomId).emit(STD.chat.serverReceiveMessage, data.chatHistory);

                } else {
                    return socket.emit(STD.chat.serverRequestFail, status, data);
                }
                next();
            });
        }
    },
    validateLeaveRoom: function () {
        return function (io, socket, body, next) {
            if (body && body.roomId) {
                next();
            } else {
                socket.emit(STD.chat.serverRequestFail, 400, {
                    code: '400_14'
                });
            }
        }
    },
    leaveRoom: function () {
        return function (io, socket, payload, next) {
            var roomId = payload.roomId;

            var body = {
                roomId: roomId,
                name: payload.name,
                socketId: socket.id,
                type: 'leave'
            };

            sequelize.models.NoSessionChatRoomUser.deleteNoSessionChatRoomUser(body, function (status, data) {
                if (status == 200) {
                    socket.emit(STD.chat.serverLeaveRoom, data);
                    socket.broadcast.to(roomId).emit(STD.chat.serverReceiveMessage, data);
                } else {
                    return socket.emit(STD.chat.serverRequestFail, status, data);
                }
                next();
            });
        }
    },
    validateSendMessage: function () {
        return function (io, socket, body, next) {
            if (body && body.roomId) {
                next();
            } else {
                socket.emit(STD.chat.serverRequestFail, 400, {
                    code: '400_14'
                });
            }
        }
    },
    sendMessage: function () {
        return function (io, socket, payload, next) {
            var roomId = payload.roomId;

            var body = {
                socketId: socket.id,
                name: payload.name,
                roomId: roomId,
                message: payload.message,
                type: 'normal'
            };

            if (payload.admin) {
                body.type = 'admin';
            }

            sequelize.models.NoSessionChatHistory.createNoSessionChatHistory(body, function (status, data) {
                if (status == 200) {

                    socket.emit(STD.chat.serverCheckMessage, data);
                    socket.broadcast.to(roomId).emit(STD.chat.serverReceiveMessage, data);

                } else {
                    return socket.emit(STD.chat.serverRequestFail, status, data);
                }
                next();
            });
        }
    },
    disconnect: function () {
        return function (io, socket, payload, next) {

            // var body = {
            //     socketId: socket.id
            // };
            //
            // sequelize.models.NoSessionChatRoomUser.destroyData({
            //     socketId: socket.id
            // }, false, function (status, data) {
            //     if (status == 200) {
            //         socket.broadcast.emit(STD.chat.serverLeaveRoom, body);
            //     } else {
            //         return socket.emit(STD.chat.serverRequestFail, status, data);
            //     }
            //     socket.disconnect();
            //     next();
            // });

            sequelize.models.NoSessionChatRoomUser.findAndDeleteNoSessionChatRoomUser(socket.id, function (status, data) {
                if (status == 200) {
                    socket.broadcast.emit(STD.chat.serverReceiveMessage, data);
                    socket.disconnect();
                    next();
                } else {
                    return socket.emit(STD.chat.serverRequestFail, status, data);
                }
            });
        }
    }
};

module.exports = middles;