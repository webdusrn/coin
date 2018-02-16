var async = require('async');
var sequelize = require('../../server/config/sequelize');

var validateManager = require('./validateManager');
var coreUtils = require('../utils');
var STD = require('../../../bridge/metadata/standards');
var NOTIFICATIONS = require('../../../bridge/metadata/notifications');
var errorHandler = require('sg-sequelize-error-handler');

var middles = {

    authorization: function (handshake, callback) {

        // console.log(handshake.session);

        if (handshake.session && handshake.session.passport && handshake.session.passport.user) {

            var userId = handshake.session.passport.user;

            sequelize.models.User.findUserById(userId, function (status, data) {

                if (status == 200) {
                    handshake.user = data;
                    callback(null, true);
                } else {
                    callback(null, false);
                }

            });

        } else {
            callback(null, false);
        }

    },
    isLoggedIn: function () {
        return function (io, socket, payload, next) {
            if (socket.request.session) {
                next();
            } else {
                return socket.emit(STD.chat.serverRequestFail, 401);
            }
        }
    },
    createRoom: function () {
        return function (io, socket, payload, next) {

            var body = {
                name: ''
            };

            var instance = sequelize.models.ChatRoom.build(body);
            instance.create(function (status, data) {
                if (status == 200) {
                    var roomId = data.id;

                    socket.join(roomId);
                    socket.broadcast.to(roomId).emit(STD.chat.serverJoinUser, data);

                    console.log('JOIN ROOM LIST', socket.adapter.rooms[roomId]);
                } else {
                    console.log(socket.id + ' fail to join');
                    return socket.emit(STD.chat.serverRequestFail, status, data);
                }

                next();
            });

        }
    },
    joinRoom: function () {
        return function (io, socket, payload, next) {

            var user = socket.request.user;

            var body = {
                userId: user.id,
                roomId: payload.roomId
            };

            sequelize.models.ChatRoomUser.findOrCreateChatRoomUser(body, function (status, data) {

                if (status == 200) {

                    var roomId = body.roomId;

                    if (data.roomUser.room.isPrivate) {
                        data.roomUser.room.roomUsers.forEach(function (roomUser) {
                            if (roomUser.userId != user.id) {
                                socket.broadcast.to(STD.chat.userRoomPrefix + roomUser.userId).emit(STD.chat.serverRequestJoinRoom, {
                                    roomId: roomId
                                });
                            }
                        });
                    }

                    socket.join(roomId);
                    socket.broadcast.to(roomId).emit(STD.chat.serverJoinUser, data.chatHistory);
                    delete data.chatHistory;
                    socket.emit(STD.chat.serverJoinRoom, data);
                    // console.log('JOIN ROOM LIST', socket.adapter.rooms[roomId]);

                } else {
                    console.log(socket.id + ' fail to join');
                    return socket.emit(STD.chat.serverRequestFail, status, data);
                }

                next();

            });

        }
    },
    requestJoinRoom: function () {
        return function (io, socket, payload, next) {

            var user = socket.request.user;

            var body = {
                userId: user.id,
                roomId: payload.roomId
            };

            socket.join(payload.roomId);

            next();
        }
    },
    joinAllRoomsFromDB: function () {
        return function (io, socket, payload, next) {
            var user = socket.request.user;

            var body = {
                userId: user.id
            };

            sequelize.models.ChatRoomUser.findChatRoomUsersByOptions(body, function (status, data) {
                if (status == 200) {

                    var roomUsers = data.rows;

                    for (var i = 0; i < roomUsers.length; i++) {
                        socket.join(roomUsers[i].roomId);
                    }

                    socket.emit(STD.chat.serverJoinAllRooms, data);

                } else {
                    return socket.emit(STD.chat.serverRequestFail, status, data);
                }

                next();
            });

        }
    },
    leaveRoom: function () {
        return function (io, socket, payload, next) {

            var user = socket.request.user;
            var roomId = payload.roomId;

            sequelize.models.ChatRoomUser.deleteChatRoomUser(user.id, roomId, function (status, data) {
                if (status == 200) {
                    socket.leave(roomId);
                    socket.emit(STD.chat.serverLeaveRoom, data);
                    socket.broadcast.to(roomId).emit(STD.chat.serverLeaveUser, data);
                    // console.log('OUT ROOM LIST', socket.adapter.rooms[roomId]);
                } else {
                    console.log(socket.id + ' fail to leave');
                    return socket.emit(STD.chat.serverRequestFail, status, data);
                }

                next();
            });

        }
    },
    validateJoinRoom: function () {
        return function (io, socket, payload, next) {

            validateManager.check('roomId', '400_12').isId();

            validateManager.checkError(socket, payload, next);
        }
    },
    validateLeaveRoom: function () {
        return function (io, socket, payload, next) {

            validateManager.check('roomId', '400_12').isId();

            validateManager.checkError(socket, payload, next);
        }
    },
    validateTyping: function () {
        return function (io, socket, payload, next) {

            validateManager.check('roomId', '400_12').isId();
            validateManager.check('isTyping', '400_20').isBoolean();

            validateManager.checkError(socket, payload, next);
        }
    },
    validateSendMessage: function () {
        return function (io, socket, payload, next) {
            var CHAT_HISTORY = STD.chatHistory;
            validateManager.check('roomId', '400_12').isId();
            validateManager.check('type', '400_20').isEnum(CHAT_HISTORY.chatHistoryEnum);
            validateManager.check('isPrivate', '400_20').isBoolean();

            if (payload.type == STD.chatHistory.text) {
                validateManager.check('message', '400_51').len(CHAT_HISTORY.minMessageLength, CHAT_HISTORY.maxMessageLength);
            }
            if (payload.type == STD.chatHistory.image) {
                validateManager.check('imageId', '400_12').isId();
            }

            validateManager.checkError(socket, payload, next);
        }
    },
    validateReadMessage: function () {
        return function (io, socket, payload, next) {
            validateManager.check('roomId', '400_12').isId();

            validateManager.checkError(socket, payload, next);
        }
    },
    checkPrivateChatRoomUser: function () {
        return function (io, socket, payload, next) {

            if (payload.isPrivate) {
                var user = socket.request.user;

                sequelize.models.ChatHistory.findOrUpdatePrivateChatRoomUser(payload.roomId, user.id, function (status, data) {
                    if (status == 204) {
                        next();
                    } else {
                        return socket.emit(STD.chat.serverRequestFail, status, data);
                    }
                });
            } else {
                next();
            }

        }
    },
    sendMessage: function () {
        return function (io, socket, payload, next) {

            var user = socket.request.user;

            var body = {
                userId: user.id,
                roomId: payload.roomId,
                message: payload.message,
                type: payload.type,
                imageId: payload.imageId
            };

            sequelize.models.ChatHistory.createChatHistory(body, function (status, data) {
                if (status == 200) {
                    socket.emit(STD.chat.serverCheckMessage, data);
                    socket.broadcast.to(payload.roomId).emit(STD.chat.serverReceiveMessage, data);

                    if (data.room.isPrivate) {
                        data.room.roomUsers.forEach(function (roomUser) {
                            if (roomUser.userId != user.id) {
                                coreUtils.notification.all.sendNotification(roomUser.userId, NOTIFICATIONS.chat, {
                                    roomId: payload.roomId,
                                    type: data.type,
                                    message: data.message,
                                    userNick: user.nick,
                                    imageName: user.userImages.length > 0 ? user.userImages[0].image.name : '',
                                    dateFolder: user.userImages.length > 0 ? user.userImages[0].image.dateFolder : ''
                                });
                            }
                        });
                    }

                } else {
                    console.log(socket.id + ' fail to join');
                    return socket.emit(STD.chat.serverRequestFail, status, data);
                }

                // console.log(socket.adapter.rooms[roomId]);

                next();
            });
        }
    },
    readMessage: function () {
        return function (io, socket, payload, next) {

            var user = socket.request.user;

            sequelize.models.ChatRoomUser.updateChatRoomUserUpdatedAt(user.id, payload.roomId, function (status, data) {
                if (status == 204) {
                    socket.broadcast.to(payload.roomId).emit(STD.chat.serverReadMessage, data);
                } else {
                    return socket.emit(STD.chat.serverRequestFail, status, data);
                }

                next();
            });

        }
    },
    onTyping: function () {
        return function (io, socket, payload, next) {

            var user = socket.request.user;

            socket.broadcast.to(payload.roomId).emit(STD.chat.serverTyping, {
                isTyping: payload.isTyping,
                userId: user.id,
                roomId: payload.roomId
            });

            next();
        }
    },
    disconnect: function () {
        return function (io, socket, payload, next) {

            var user = socket.request.user;

            sequelize.models.ChatRoomUser.leavePublicRooms(user.id, function (status, data) {
                if (status == 200) {

                    data.forEach(function (chatHistory) {
                        var roomId = chatHistory.roomId;
                        socket.leave(roomId);
                        socket.broadcast.to(roomId).emit(STD.chat.serverLeaveUser, chatHistory);
                    });

                }
                socket.disconnect();
            });

            next();
        }
    }
};

module.exports = middles;