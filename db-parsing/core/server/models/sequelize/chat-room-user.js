/**
 * Category model module.
 * @module app/server/models/sequelize/app-chat-room-user
 */

/**
 * 응답콜백
 * @callback responseCallback
 * @param {number} status - 상태코드
 * @param {Object} data - 성공일 경우 반환된 데이터
 */

var Sequelize = require('sequelize');
var sequelize = require('../../../../core/server/config/sequelize');

var mixin = require('../../../../core/server/models/sequelize/mixin');
var errorHandler = require('sg-sequelize-error-handler');

var STD = require('../../../../bridge/metadata/standards');
var micro = require('microtime-nodejs');
var config = require('../../../../bridge/config/env');
var coreUtils = require("../../../../core/server/utils");

module.exports = {
    fields: {
        'userId': {
            'reference': 'User',
            'referenceKey': 'id',
            'referenceType': 'one',
            'as': 'user',
            'allowNull': false
        },
        'roomId': {
            'reference': 'ChatRoom',
            'referenceKey': 'id',
            'referenceType': 'many',
            'as': 'room',
            'asReverse': 'roomUsers',
            'allowNull': false
        },
        'noView': {
            'type': Sequelize.INTEGER,
            'allowNull': false,
            'defaultValue': 0
        },
        'createdAt': {
            'type': Sequelize.BIGINT,
            'allowNull': true
        },
        'updatedAt': {
            'type': Sequelize.BIGINT,
            'allowNull': true
        },
        'deletedAt': {
            'type': Sequelize.DATE,
            'allowNull': true
        }
    },
    options: {
        'timestamps': true,
        'updatedAt': false,
        'charset': config.db.charset,
        'paranoid': true,
        'hooks': {
            'beforeCreate': mixin.options.hooks.microCreatedAt,
            'beforeBulkUpdate': mixin.options.hooks.useIndividualHooks,
            'beforeUpdate': mixin.options.hooks.microUpdatedAt,
        },
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            'getIncludeChatRoomUser': function () {
                return [{
                    model: sequelize.models.User,
                    as: 'user',
                    attributes: sequelize.models.User.getUserFields(),
                    include: sequelize.models.User.getIncludeUser()
                }, {
                    model: sequelize.models.ChatRoom,
                    as: 'room',
                    include: [
                        {
                            model: sequelize.models.ChatRoomUser,
                            as: 'roomUsers',
                            paranoid: false,
                            include: {
                                model: sequelize.models.User,
                                as: 'user',
                                attributes: sequelize.models.User.getUserFields(),
                                include: sequelize.models.User.getIncludeUser()
                            }
                        }
                    ]
                }]
            },
            'getIncludeChatRoomUserParanoidTrue': function () {
                return [{
                    model: sequelize.models.User,
                    as: 'user',
                    attributes: sequelize.models.User.getUserFields(),
                    include: sequelize.models.User.getIncludeUser()
                }, {
                    model: sequelize.models.ChatRoom,
                    as: 'room',
                    include: [
                        {
                            model: sequelize.models.ChatRoomUser,
                            as: 'roomUsers',
                            paranoid: true,
                            include: {
                                model: sequelize.models.User,
                                as: 'user',
                                attributes: sequelize.models.User.getUserFields(),
                                include: sequelize.models.User.getIncludeUser()
                            }
                        }
                    ]
                }]
            },
            'findOrCreateChatRoomUser': function (body, callback) {

                var chatRoomUser;
                var chatHistory;
                var chatHistories;

                sequelize.transaction(function (t) {

                    return sequelize.models.ChatRoomUser.findOne({
                        where: {
                            userId: body.userId,
                            roomId: body.roomId
                        },
                        include: sequelize.models.ChatRoomUser.getIncludeChatRoomUserParanoidTrue(),
                        paranoid: false,
                        transaction: t
                    }).then(function (data) {

                        if (data) {
                            chatRoomUser = data;

                            chatRoomUser.setDataValue('noView', 0);
                            chatRoomUser.setDataValue('updatedAt', micro.now());
                            chatRoomUser.setDataValue('deletedAt', null);
                            return chatRoomUser.save({paranoid: false});

                        } else {
                            return sequelize.models.ChatRoomUser.create(body, {
                                transaction: t
                            }).then(function (data) {

                                return sequelize.models.ChatRoomUser.findOne({
                                    where: {
                                        id: data.id
                                    },
                                    include: sequelize.models.ChatRoomUser.getIncludeChatRoomUserParanoidTrue(),
                                    transaction: t
                                });

                            }).then(function (data) {
                                chatRoomUser = data;
                                return true;
                            });
                        }

                    }).then(function () {

                        if (chatRoomUser.room.isPrivate) {
                            return true;
                        } else {
                            return sequelize.models.ChatHistory.create({
                                userId: body.userId,
                                roomId: body.roomId,
                                type: STD.chatHistory.join
                            }, {
                                include: [{
                                    model: sequelize.models.User,
                                    as: 'user',
                                    attributes: sequelize.models.User.getUserFields(),
                                    include: [{
                                        model: sequelize.models.UserImage,
                                        as: 'userImages',
                                        include: {
                                            model: sequelize.models.Image,
                                            as: 'image'
                                        }
                                    }]
                                }],
                                transaction: t
                            }).then(function (data) {
                                chatHistory = data;
                            });
                        }

                    }).then(function () {

                        return sequelize.models.ChatHistory.findAll({
                            'limit': 10,
                            'where': {
                                roomId: body.roomId
                            },
                            'order': [['createdAt', 'DESC']],
                            'include': [{
                                model: sequelize.models.User,
                                as: 'user',
                                attributes: sequelize.models.User.getUserFields()
                            }, {
                                model: sequelize.models.ChatRoom,
                                as: 'room'
                            }, {
                                model: sequelize.models.Image,
                                as: 'image'
                            }],
                            transaction: t
                        });

                    }).then(function (data) {
                        chatHistories = data;
                        return true;
                    });

                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {

                        chatRoomUser.reload().then(function () {
                            if (chatRoomUser.room.isPrivate) {
                                callback(200, {
                                    roomUser: chatRoomUser,
                                    chatHistories: chatHistories
                                });
                            } else {
                                chatHistory.reload().then(function () {
                                    callback(200, {
                                        roomUser: chatRoomUser,
                                        chatHistory: chatHistory,
                                        chatHistories: chatHistories
                                    });
                                });
                            }

                        });

                    }
                });

            },
            'findChatRoomUsersByOptions': function (options, callback) {

                var where = {};

                if (options.roomId !== undefined) {
                    where.roomId = options.roomId
                }

                if (options.userId !== undefined) {
                    where.userId = options.userId
                }

                var chatRoomUser = {
                    count: 0,
                    rows: []
                };

                sequelize.transaction(function (t) {

                    return sequelize.models.ChatRoomUser.findAll({
                        'where': where,
                        'include': sequelize.models.ChatRoomUser.getIncludeChatRoomUser(),
                        'paranoid': false,
                        'transaction': t
                    }).then(function (data) {
                        if (data.length > 0) {
                            chatRoomUser.count = data.length;
                            chatRoomUser.rows = data;
                            return true;
                        } else {
                            throw new errorHandler.CustomSequelizeError(404);
                        }
                    });

                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(200, chatRoomUser);
                    }
                });

            },
            'deletePrivateChatRoomUser': function (userId, roomId, callback) {

                return sequelize.models.ChatRoomUser.destroy({
                    where: {
                        userId: userId,
                        roomId: roomId
                    }
                }).then(function () {
                    return true;
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(204);
                    }
                });
            },
            'deleteChatRoomUser': function (userId, roomId, callback) {

                var chatHistory;

                return sequelize.models.ChatRoomUser.destroy({
                    where: {
                        userId: userId,
                        roomId: roomId
                    }
                }).then(function () {

                    return sequelize.models.ChatHistory.create({
                        userId: userId,
                        roomId: roomId,
                        type: STD.chatHistory.leave
                    }, {
                        include: [{
                            model: sequelize.models.User,
                            as: 'user',
                            attributes: sequelize.models.User.getUserFields(),
                            include: [{
                                model: sequelize.models.UserImage,
                                as: 'userImages',
                                include: {
                                    model: sequelize.models.Image,
                                    as: 'image'
                                }
                            }]
                        }]
                    });

                }).then(function (data) {
                    chatHistory = data;
                    return true;

                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        chatHistory.reload().then(function () {
                            return callback(200, chatHistory);
                        });
                    }
                });
            },
            /**
             * 상대방이 방을 나가있으면 해당 유저의 deleteAt을 지워서 다시 방에 초대한다.
             * @param roomId
             * @param sendUserId
             * @param callback
             */
            'findOrUpdatePrivateChatRoomUser': function (roomId, sendUserId, callback) {
                sequelize.transaction(function (t) {

                    return sequelize.models.ChatRoomUser.findAll({
                        'where': {
                            roomId: roomId
                        },
                        'paranoid': false,
                        'transaction': t
                    }).then(function (data) {
                        if (data.length > 0) {

                            var indexToBeUpdated;

                            for (var i = 0; i < data.length; i++) {
                                if (data[i].userId != sendUserId && data[i].deletedAt) {
                                    indexToBeUpdated = i;
                                }
                            }

                            if (indexToBeUpdated !== undefined) {
                                var chatRoomUser = data[indexToBeUpdated];
                                chatRoomUser.setDataValue('createdAt', micro.now());
                                chatRoomUser.setDataValue('deletedAt', null);
                                return chatRoomUser.save({paranoid: false});
                            } else {
                                return true;
                            }

                        } else {
                            throw new errorHandler.CustomSequelizeError(404);
                        }
                    }).then(function (data) {
                        return true;
                    });

                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(204);
                    }
                });

            },
            'updateChatRoomUserUpdatedAt': function (userId, roomId, callback) {

                var chatRoomUser;

                sequelize.models.ChatRoomUser.update({
                    noView: 0,
                    updatedAt: micro.now()
                }, {
                    'where': {
                        userId: userId,
                        roomId: roomId
                    },
                    'paranoid': false
                }).then(function (data) {

                    if (data[0] > 0 || data[1][0]) {
                        chatRoomUser = data[1][0];
                        return true;
                    } else {
                        throw new errorHandler.CustomSequelizeError(400);
                    }

                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(204, chatRoomUser);
                    }
                });

            },
            'getNewChatMessageCount': function (userId, callback) {

                var rowQuery = "SELECT sum(noView) as count FROM ChatRoomUsers WHERE userId = " + userId;

                sequelize.query(rowQuery, {
                    type: sequelize.QueryTypes.SELECT,
                    raw: true
                }).then(function (data) {
                    if (data.length > 0) {
                        return data;
                    } else {
                        throw new errorHandler.CustomSequelizeError(404);
                    }
                }).catch(errorHandler.catchCallback(callback)).done(function (data) {
                    if (data) {
                        callback(200, data[0].count);
                    }
                });

            },
            'leavePublicRooms': function (userId, callback) {

                var chatRooms;
                var chatHistories;

                sequelize.models.ChatRoom.findAll({
                    where: {
                        isPrivate: false
                    },
                    include: [{
                        model: sequelize.models.ChatRoomUser,
                        as: 'roomUsers',
                        where: {
                            userId: userId
                        },
                        include: [{
                            model: sequelize.models.User,
                            as: 'user',
                            attributes: sequelize.models.User.getUserFields(),
                            include: [{
                                model: sequelize.models.UserImage,
                                as: 'userImages',
                                include: {
                                    model: sequelize.models.Image,
                                    as: 'image'
                                }
                            }]
                        }]
                    }]
                }).then(function (data) {

                    if (data) {
                        chatRooms = data;

                        var tempIds = [];
                        chatRooms.forEach(function (chatRoom) {
                            tempIds.push(chatRoom.id);
                        });

                        return sequelize.models.ChatRoomUser.destroy({
                            where: {
                                userId: userId,
                                roomId: tempIds
                            }
                        });
                    } else {
                        throw new errorHandler.CustomSequelizeError(404);
                    }

                }).then(function () {

                    var temp = [];

                    chatRooms.forEach(function (chatRoom) {
                        temp.push({
                            userId: userId,
                            roomId: chatRoom.id,
                            type: STD.chatHistory.leave
                        });
                    });

                    return sequelize.models.ChatHistory.bulkCreate(temp, {
                        'individualHooks': true,
                        include: [{
                            model: sequelize.models.User,
                            as: 'user',
                            attributes: sequelize.models.User.getUserFields(),
                            include: [{
                                model: sequelize.models.UserImage,
                                as: 'userImages',
                                include: {
                                    model: sequelize.models.Image,
                                    as: 'image'
                                }
                            }]
                        }]
                    });

                }).then(function (data) {
                    chatHistories = data;
                    return true;
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {

                        chatHistories.forEach(function (chatHistory) {
                            chatHistory.dataValues.user = chatRooms[0].roomUsers[0].user;
                        });

                        callback(200, chatHistories);
                    }
                });

            }
        })
    }
};