/**
 * Category model module.
 * @module app/server/models/sequelize/app-chat-room
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

var coreUtils = require('../../utils');
var config = require('../../../../bridge/config/env');
var coreUtils = require("../../../../core/server/utils");

module.exports = {
    fields: {
        'name': {
            'type': Sequelize.STRING,
            'allowNull': true
        },
        'isPrivate': {
            'type': Sequelize.BOOLEAN,
            'allowNull': false
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
            'beforeUpdate': mixin.options.hooks.microUpdatedAt
        },
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            'findChatRoomsByOption': function (options, callback) {

                var chatRoom = {
                    count: 0,
                    rows: []
                };

                var searchItemQuery = "";

                if (options.searchItem !== undefined) {
                    searchItemQuery = " AND user.nick LIKE '" + options.searchItem + "%'";
                }

                var countQuery = "SELECT count(result.id) as count FROM (SELECT v1.id FROM (SELECT * FROM ChatRoomUsers AS chatRoomUser WHERE chatRoomUser.deletedAt IS NULL AND chatRoomUser.userId = " + options.userId + ") as v1 " +
                    "LEFT JOIN (SELECT roomUser.roomId as roomId FROM ChatRoomUsers as roomUser " +
                    "LEFT JOIN Users as user ON user.id = roomUser.userId " +
                    "WHERE roomUser.userId <> " + options.userId + searchItemQuery + ") as v2 ON v1.roomId = v2.roomId GROUP BY v1.id) as result;";

                var query = "SELECT v1.roomId as id, v1.updatedAt as updatedAt, v2.roomUserId as 'user.id', v2.nick as 'user.nick', v2.deletedAt as 'user.deletedAt', v1.count as noReadCount, v2.userImageId as 'user.userImages.id', v2.imageId as 'user.userImages.image.id', v2.folder as 'user.userImages.image.folder', v2.dateFolder as 'user.userImages.image.dateFolder', v2.name as 'user.userImages.image.name', v2.authorized as 'user.userImages.image.authorized', v1.chatId as 'chatHistories.id', v1.chatType as 'chatHistories.type', v1.chatMessage as 'chatHistories.message', v1.chatCreatedAt as 'chatHistories.createdAt' " +
                    "FROM (SELECT a.roomId, a.updatedAt, a.chatId, a.chatType, a.chatMessage, a.chatCreatedAt, count(case when a.chatCreatedAt > a.roomUserUpdatedAt then 1 else null end) as count FROM (SELECT room.id as roomId, room.updatedAt as updatedAt, chatHistory.id as chatId, chatHistory.type as chatType, chatHistory.message as chatMessage, chatHistory.createdAt as chatCreatedAt, roomUser.updatedAt as roomUserUpdatedAt " +
                    "FROM `ChatRooms` as room " +
                    "LEFT JOIN `ChatRoomUsers` as roomUser ON room.id = roomUser.roomId " +
                    "LEFT JOIN (SELECT chatHistory.* FROM ChatHistories as chatHistory LEFT JOIN ChatRoomUsers as roomUser ON chatHistory.roomId = roomUser.roomId WHERE roomUser.userId = " + options.userId + " AND chatHistory.createdAt > roomUser.createdAt) as chatHistory ON room.id = chatHistory.roomId " +
                    "LEFT JOIN `Users` as user ON user.id = roomUser.userId " +
                    "WHERE room.isPrivate = TRUE AND roomUser.userId = " + options.userId + " AND roomUser.deletedAt IS NULL " +
                    "ORDER BY chatHistory.createdAt DESC) AS a GROUP BY a.roomId ) as v1 " +
                    "INNER JOIN (SELECT roomUser.roomId as roomId, user.nick as nick, user.id as roomUserId, user.deletedAt as deletedAt, userImages.id as userImageId, image.id as imageId, image.folder as folder, image.dateFolder as dateFolder, image.name as name, image.authorized as authorized FROM ChatRoomUsers as roomUser " +
                    "LEFT JOIN Users as user ON user.id = roomUser.userId " +
                    "LEFT JOIN UserImages as userImages ON userImages.userId = user.id " +
                    "LEFT JOIN Images as image ON image.id = userImages.imageId " +
                    "WHERE roomUser.userId <> " + options.userId + searchItemQuery + ") as v2 ON v1.roomId = v2.roomId " +
                    "WHERE v1.updatedAt < " + options.last + " " +
                    "GROUP BY roomUserId " +
                    "ORDER BY updatedAt DESC LIMIT " + options.size;

                sequelize.transaction(function (t) {
                    return sequelize.query(countQuery, {
                        type: sequelize.QueryTypes.SELECT,
                        raw: true,
                        transaction: t
                    }).then(function (data) {

                        if (data[0].count > 0) {
                            chatRoom.count = data[0].count;

                            return sequelize.query(query, {
                                type: sequelize.QueryTypes.SELECT,
                                raw: true,
                                transaction: t
                            });
                        } else {
                            throw new errorHandler.CustomSequelizeError(404);
                        }

                    }).then(function (result) {

                        if (result.length > 0) {
                            chatRoom.rows = coreUtils.objectify.convert(result, {
                                user: {
                                    userImages: [{
                                        image: {
                                            attributes: sequelize.models.Image.attributes,
                                        }
                                    }]
                                },
                                chatHistories: [{}]
                            });

                            return true;
                        } else {
                            throw new errorHandler.CustomSequelizeError(404);
                        }
                    });
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(200, chatRoom);
                    }
                });

            },
            'findOrCreatePrivateChatRoom': function (userId, partnerId, callback) {

                var chatRoom;

                sequelize.transaction(function (t) {

                    return sequelize.models.ChatRoomUser.findAll({
                        'where': {
                            userId: userId
                        },
                        'include': [{
                            model: sequelize.models.ChatRoom,
                            as: 'room',
                            where: {
                                isPrivate: true
                            },
                            include: {
                                model: sequelize.models.ChatRoomUser,
                                as: 'roomUsers',
                                paranoid: false,
                                where: {
                                    userId: partnerId
                                }
                            }
                        }],
                        'paranoid': false,
                        'transaction': t
                    }).then(function (data) {
                        if (data && data[0]) {
                            chatRoom = data[0].room;

                            if (data[0].deletedAt) {
                                data[0].setDataValue('createdAt', micro.now());
                            }

                            data[0].setDataValue('deletedAt', null);
                            return data[0].save({paranoid: false}).then(function () {
                                chatRoom.setDataValue('updatedAt', micro.now());
                                return chatRoom.save({paranoid: false});
                            });

                        } else {

                            return sequelize.models.ChatRoom.create({
                                isPrivate: true
                            }, {
                                'transaction': t
                            }).then(function (data) {
                                chatRoom = data;

                                var chatRoomUsers = [];
                                chatRoomUsers.push({
                                    userId: userId,
                                    roomId: data.id
                                });
                                chatRoomUsers.push({
                                    userId: partnerId,
                                    roomId: data.id,
                                    deletedAt: new Date()
                                });

                                return sequelize.models.ChatRoomUser.bulkCreate(chatRoomUsers, {
                                    'individualHooks': true,
                                    'transaction': t
                                });

                            });
                        }
                    }).then(function () {
                        return true;
                    })

                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        return chatRoom.reload().then(function () {
                            delete chatRoom.dataValues.roomUsers;
                            callback(200, chatRoom);
                        });
                    }
                });

            }
        })
    }
};