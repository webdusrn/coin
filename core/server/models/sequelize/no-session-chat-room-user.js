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
        'socketId': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': false
        },
        'name': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': false
        },
        'roomId': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': false
        },
        'createdAt': {
            'type': Sequelize.BIGINT,
            'allowNull': true
        },
        'updatedAt': {
            'type': Sequelize.BIGINT,
            'allowNull': true
        }
    },
    options: {
        'timestamps': true,
        'updatedAt': false,
        'charset': config.db.charset,
        'paranoid': false,
        'hooks': {
            'beforeCreate': mixin.options.hooks.microCreatedAt,
            'beforeBulkUpdate': mixin.options.hooks.useIndividualHooks,
            'beforeUpdate': mixin.options.hooks.microUpdatedAt,
        },
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            'createNoSessionChatRoomUser': function (body, callback) {

                var chatRoomUsers;
                var chatHistory;
                var chatHistories;

                sequelize.transaction(function (t) {
                    return sequelize.models.NoSessionChatRoomUser.create(body, {
                        transaction: t
                    }).then(function (data) {

                        if (data) {
                            return sequelize.models.NoSessionChatRoomUser.findAll({
                                where: {
                                    roomId: body.roomId
                                },
                                transaction: t
                            });

                        } else {
                            throw new errorHandler.CustomSequelizeError(404);
                        }

                    }).then(function (data) {

                        if (data.length > 0) {
                            chatRoomUsers = data;

                            return sequelize.models.NoSessionChatHistory.create(body, {
                                transaction: t
                            });

                        } else {
                            throw new errorHandler.CustomSequelizeError(404);
                        }

                    }).then(function (data) {
                        if (data) {
                            chatHistory = data;
                            return sequelize.models.NoSessionChatHistory.findAll({
                                where: {
                                    $or: [{
                                        type: 'normal'
                                    }, {
                                        type: 'admin'
                                    }]
                                },
                                limit: 20,
                                order: [['createdAt', 'DESC']],
                                transaction: t
                            });
                        } else {
                            throw new errorHandler.CustomSequelizeError(404);
                        }
                    }).then(function (data) {

                        if (data.length) {
                            chatHistories = data;
                            return true;
                        } else {
                            throw new errorHandler.CustomSequelizeError(404);
                        }

                    });
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(200, {
                            chatRoomUsers: chatRoomUsers,
                            chatHistory: chatHistory,
                            chatHistories: chatHistories.reverse()
                        });
                    }
                });

            },
            'deleteNoSessionChatRoomUser': function (body, callback) {

                var chatHistory;

                sequelize.transaction(function (t) {
                    return sequelize.models.NoSessionChatRoomUser.destroy({
                        where: {
                            socketId: body.socketId
                        },
                        transaction: t
                    }).then(function () {
                        return sequelize.models.NoSessionChatHistory.create(body, {
                            transaction: t
                        });
                    }).then(function (data) {
                        if (data) {
                            chatHistory = data;
                            return true;
                        } else {
                            throw new errorHandler.CustomSequelizeError(404);
                        }

                    });
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(200, chatHistory);
                    }
                });
            },
            'findAndDeleteNoSessionChatRoomUser': function (socketId, callback) {

                var body = {
                    roomId: '',
                    name: '',
                    socketId: '',
                    type: 'leave'
                };

                var chatHistory;

                sequelize.transaction(function (t) {

                    return sequelize.models.NoSessionChatRoomUser.findOne({
                        where: {
                            socketId: socketId
                        },
                        transaction: t
                    }).then(function (data) {

                        if (data) {
                            body.roomId = data.roomId;
                            body.name = data.name;
                            body.socketId = data.socketId;
                            return sequelize.models.NoSessionChatRoomUser.destroy({
                                where: {
                                    socketId: socketId
                                },
                                transaction: t
                            })
                        } else {
                            throw new errorHandler.CustomSequelizeError(404);
                        }

                    }).then(function () {
                        return sequelize.models.NoSessionChatHistory.create(body, {
                            transaction: t
                        });
                    }).then(function (data) {
                        if (data) {
                            chatHistory = data;
                            return true;
                        } else {
                            throw new errorHandler.CustomSequelizeError(404);
                        }

                    });
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(200, chatHistory);
                    }
                });
            }
        })
    }
};