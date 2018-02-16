/**
 * Test model module.
 * @module core/server/models/sequelize/test
 */

var Sequelize = require('sequelize');
var sequelize = require('../../config/sequelize');
var STD = require('../../../../bridge/metadata/standards');
var NOTIFICATIONS = require('../../../../bridge/metadata/notifications');
var mixin = require('./mixin');
var errorHandler = require('sg-sequelize-error-handler');
var config = require('../../../../bridge/config/env');
var coreUtils = require("../../../../core/server/utils");

module.exports = {
    fields: {
        'dest': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'unique': true,
            'allowNull': false
        },
        'platform': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        }
    },
    options: {
        "indexes": [{
            name: 'dest',
            fields: ['dest']
        }],
        'timestamps': true,
        'charset': config.db.charset,
        'hooks': {
            'beforeCreate': mixin.options.hooks.microCreatedAt,
            'beforeBulkUpdate': mixin.options.hooks.useIndividualHooks,
            'beforeUpdate': mixin.options.hooks.microUpdatedAt
        },
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            "createMassNotificationDest": function (phoneNumArray, callback) {
                sequelize.transaction(function (t) {
                    return sequelize.models.MassNotificationDest.bulkCreate(phoneNumArray, {
                        ignoreDuplicates: true,
                        transaction: t
                    }).then(function () {
                        return true;
                    });
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(204);
                    }
                });
            },
            "countMassNotificationDest": function (callback) {
                var count = 0;

                sequelize.models.MassNotificationDest.count().then(function (data) {
                    if (data > 0) {
                        count = data;
                        return 200;
                    } else {
                        return 404;
                    }
                }).catch(errorHandler.catchCallback(callback)).done(function (status) {
                    if (status == 200) {
                        callback(status, count);
                    } else if (status == 404) {
                        callback(status, {
                            code: "404_13"
                        });
                    }
                });
            },
            "findMassNotificationDest": function (options, callback) {
                var where = {};
                var query = {
                    where: where,
                    order: [[STD.common.id, STD.common.ASC]],
                    limit: parseInt(options.size)
                };

                if (options.last !== undefined) {
                    where[STD.common.id] = {
                        "gt": options.last
                    }
                }

                sequelize.models.MassNotificationDest.findAllDataForQuery(query, callback);
            }
        })
    }
};
