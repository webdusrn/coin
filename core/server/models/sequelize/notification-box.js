/**
 * Test model module.
 * @module core/server/models/sequelize/test
 */

var Sequelize = require('sequelize');
var sequelize = require('../../config/sequelize');
var STD = require('../../../../bridge/metadata/standards');
var mixin = require('./mixin');
var errorHandler = require('sg-sequelize-error-handler');
var config = require('../../../../bridge/config/env');
var coreUtils = require("../../../../core/server/utils");

module.exports = {
    fields: {
        'userId': {
            reference: 'User',
            referenceKey: 'id',
            as: 'author',
            asReverse: 'reports',
            allowNull: false
        },
        'key': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': false
        },
        'payload': {
            'type': Sequelize.TEXT('long'),
            'allowNull': false
        },
        'view': {
            'type': Sequelize.BOOLEAN,
            'allowNull': false,
            'defaultValue': false
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
        'charset': config.db.charset,
        'createdAt': false,
        'updatedAt': false,
        'paranoid': true, // deletedAt 추가. delete안함.
        'hooks': {
            'beforeCreate': mixin.options.hooks.microCreatedAt,
            'beforeBulkUpdate': mixin.options.hooks.useIndividualHooks,
            'beforeUpdate': mixin.options.hooks.microUpdatedAt
        },
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            'getNotificationBoxInclude': function () {
                return [{
                    model: sequelize.models.Notification,
                    as: 'notification'
                }]
            },
            'findNotificationBoxesByOptions': function (options, callback) {
                var where = {};
                var query = {
                    'offset': parseInt(options.offset),
                    'limit': parseInt(options.size),
                    'where': where,
                    'order': [[options.orderBy, options.sort]],
                };

                where.createdAt = {
                    '$lt': options.last
                };

                if (options.userId !== undefined) {
                    where.userId = options.userId;
                }

                if (options.key !== undefined) {
                    where.key = options.key;
                }

                sequelize.models.NotificationBox.findAndCountAll(query).then(function (data) {
                    if (data && data.rows.length > 0) {
                        return data;
                    } else {
                        throw new errorHandler.CustomSequelizeError(404);
                    }
                }).catch(errorHandler.catchCallback(callback)).done(function (data) {
                    if (data) {
                        callback(200, data);
                    }
                });
            },
            "findNewNotificationCount": function (userId, options, callback) {
                var boxCount;
                var where = {
                    userId: userId,
                    view: false
                };

                if (options.key !== undefined) {
                    where.key = options.key;
                }

                sequelize.models.NotificationBox.count({
                    where: where
                }).then(function (count) {

                    boxCount = count;
                    return true;

                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(200, boxCount);
                    }
                });

            }
        })
    }
};
