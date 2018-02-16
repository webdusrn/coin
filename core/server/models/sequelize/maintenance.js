
/**
 * 응답콜백
 * @callback responseCallback
 * @param {number} status - 상태코드
 * @param {Object} data - 성공일 경우 반환된 데이터
 */

var Sequelize = require('sequelize');
var sequelize = require('../../config/sequelize');

var mixin = require('../sequelize/mixin');
var errorHandler = require('sg-sequelize-error-handler');

var STD = require('../../../../bridge/metadata/standards');
var LOCAL = require('../../../../bridge/metadata/localization');
var CONFIG = require('../../../../bridge/config/env');
var getDBStringLength = require('../../utils').initialization.getDBStringLength;
module.exports = {
    fields: {
        'domain': {
            'type': Sequelize.STRING(getDBStringLength()),
            'allowNull': false
        },
        'faviconImageId': {
            'reference': 'Image',
            'referenceKey': 'id',
            'referenceType': 'one',
            'as': 'faviconImage',
            'asReverse': 'maintenance',
            'allowNull': true
        },
        'maintenanceImageId': {
            'reference': 'Image',
            'referenceKey': 'id',
            'referenceType': 'one',
            'as': 'maintenanceImage',
            'asReverse': 'maintenance',
            'allowNull': true
        },
        'title': {
            'type': Sequelize.STRING(getDBStringLength()),
            'allowNull': true
        },
        'subTitle': {
            'type': Sequelize.STRING(getDBStringLength()),
            'allowNull': true
        },
        'timeLabel': {
            'type': Sequelize.STRING(getDBStringLength()),
            'allowNull': true
        },
        'titleColor': {
            'type': Sequelize.STRING(getDBStringLength()),
            'allowNull': true
        },
        'subTitleColor': {
            'type': Sequelize.STRING(getDBStringLength()),
            'allowNull': true
        },
        'backgroundColor': {
            'type': Sequelize.STRING(getDBStringLength()),
            'allowNull': true
        },
        'timeColor': {
            'type': Sequelize.STRING(getDBStringLength()),
            'allowNull': true
        },
        'startTime': {
            'type': Sequelize.DATE,
            'allowNull': true
        },
        'endTime': {
            'type': Sequelize.DATE,
            'allowNull': true
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
        'indexes': [{
            name: 'domain',
            fields: ['domain'],
            unique: true
        }, {
            name: 'createdAt',
            fields: ['createdAt']
        }],
        'timestamps': true,
        'createdAt': false,
        'updatedAt': false,
        'charset': CONFIG.db.charset,
        'collate': CONFIG.db.collate,
        'hooks': {
            'beforeCreate': mixin.options.hooks.microCreatedAt,
            'beforeBulkUpdate': mixin.options.hooks.useIndividualHooks,
            'beforeUpdate': mixin.options.hooks.microUpdatedAt
        },
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            'findMaintenanceByDomain': function (domain, callback) {
                var loadedData = null;
                sequelize.models.Maintenance.findOne({
                    include: [{
                        model: sequelize.models.Image,
                        as: "faviconImage"
                    }, {
                        model: sequelize.models.Image,
                        as: "maintenanceImage"
                    }],
                    where: {
                        domain: domain
                    }
                }).then(function (data) {
                    if (data) {
                        loadedData = data;
                        return true;
                    } else {
                        throw new errorHandler.CustomSequelizeError(404);
                    }
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(200, loadedData);
                    }
                });
            }
        })
    }
};