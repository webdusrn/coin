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
            as: 'user',
            asReverse: 'notificationSwitches',
            allowNull: false
        },
        'key': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': false
        },
        'sendType': {
            'type': Sequelize.ENUM,
            'allowNull': false,
            'values': STD.notification.enumSendTypes,
            'defaultValue': STD.notification.enumSendTypes[0]
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
        "indexes": [{
            unique: true,
            fields: ['userId', 'key', 'sendType']
        }],
        'timestamps': true,
        'charset': config.db.charset,
        'createdAt': false,
        'updatedAt': false,
        'paranoid': false,
        'hooks': {
            'beforeCreate': mixin.options.hooks.microCreatedAt,
            'beforeBulkUpdate': mixin.options.hooks.useIndividualHooks,
            'beforeUpdate': mixin.options.hooks.microUpdatedAt
        },
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            getUserNotificationFields: function () {
                return ['userId', 'key', 'sendType'];
            },
            'deleteNotificationSwitch': function (body, callback) {

                sequelize.models.NotificationSwitch.destroy({
                    where: body
                }).then(function () {
                    return true
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(204);
                    }
                });

            }
        })
    }
};
