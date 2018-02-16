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
var coreUtils = require('../../utils');
var config = require('../../../../bridge/config/env');
var coreUtils = require("../../../../core/server/utils");

module.exports = {
    fields: {
        'status': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': false
        },
        'name': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'price': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'receipt': {
            'type': Sequelize.TEXT,
            'allowNull': false
        },
        'userId': {
            'reference': 'User',
            'referenceKey': 'id',
            'as': 'user',
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
        'createdAt': false,
        'updatedAt': false,
        'paranoid': true,
        'charset': config.db.charset,
        'hooks': {
            'beforeCreate': mixin.options.hooks.microCreatedAt,
            'beforeBulkUpdate': mixin.options.hooks.useIndividualHooks,
            'beforeUpdate': mixin.options.hooks.microUpdatedAt
        },
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            'startInAppPurchase': function (body, callback) {

                var InAppPurchase = STD.inAppPurchase;

                body.status = InAppPurchase.statusStart;

                sequelize.models.InAppPurchase.create(body).then(function (data) {
                    if (data) {
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
            'finishInAppPurchase': function (body, t) {

                var InAppPurchase = STD.inAppPurchase;

                return sequelize.models.InAppPurchase.findOne({
                    where: {
                        receipt: body.receipt
                    },
                    transaction: t
                }).then(function (data) {
                    if (data) {
                        return sequelize.models.InAppPurchase.update({
                            status: InAppPurchase.statusFinish,
                            name: body.name
                        }, {
                            where: {
                                receipt: body.receipt
                            },
                            transaction: t
                        });
                    } else {
                        throw new errorHandler.CustomSequelizeError(404);
                    }
                });
            },
            'findInAppPurchaseByReceipt': function (receipt, callback) {

                var inAppPurchase;

                sequelize.models.InAppPurchase.findOne({
                    where: {
                        receipt: receipt
                    }
                }).then(function (data) {
                    if (data) {
                        inAppPurchase = data;
                        return true;
                    } else {
                        throw new errorHandler.CustomSequelizeError(404);
                    }
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(200, inAppPurchase);
                    }
                });

            }
        })
    }
};