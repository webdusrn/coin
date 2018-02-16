/*** 응답콜백
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
        'type': {
            'type': Sequelize.ENUM,
            'values': STD.mobile.enumOsType,
            'allowNull': false
        },
        'majorVersion': {
            'type': Sequelize.INTEGER,
            'allowNull': false
        },
        'minorVersion': {
            'type': Sequelize.INTEGER,
            'allowNull': false
        },
        'hotfixVersion': {
            'type': Sequelize.INTEGER,
            'allowNull': false
        },
        'forceUpdate': {
            'type': Sequelize.BOOLEAN,
            'allowNull': false,
            'default': false
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
        "indexes": [{
            unique: true,
            fields: ['type', 'majorVersion', 'minorVersion', 'hotfixVersion']
        }],
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
            'getMobileVersionField': function () {
                return ['majorVersion', 'minorVersion', 'hotfixVersion'];
            },
            'findMobileVersionByType': function (type, majorVersion, minorVersion, hotfixVersion, callback) {

                var mobileVersion;

                sequelize.models.MobileVersion.findOne({
                    where: {
                        type: type
                    },
                    order: [['id', 'DESC']],
                    limit: 1,
                    attributes: sequelize.models.MobileVersion.getMobileVersionField()
                }).then(function (data) {

                    if (data) {

                        mobileVersion = data;

                        return sequelize.models.MobileVersion.findAll({
                            where: {
                                type: type,
                                $or: [{
                                    majorVersion: {
                                        $gt: majorVersion
                                    }
                                }, {
                                    $and: [{
                                        majorVersion: majorVersion,
                                        minorVersion: {
                                            $gt: minorVersion
                                        }
                                    }]
                                }, {
                                    $and: [{
                                        majorVersion: majorVersion,
                                        minorVersion: minorVersion,
                                        hotfixVersion: {
                                            $gt: hotfixVersion
                                        }
                                    }]
                                }],
                                forceUpdate: true
                            }
                        });

                    } else {
                        throw new errorHandler.CustomSequelizeError(404);
                    }

                }).then(function (data) {

                    if (data.length > 0) {
                        mobileVersion.dataValues.forceUpdate = true;
                    } else {
                        mobileVersion.dataValues.forceUpdate = false;
                    }

                    return true

                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(200, mobileVersion);
                    }
                });

            },
            'findMobileVersions': function (callback) {

                var mobileVersions = {};

                sequelize.models.MobileVersion.findOne({
                    where: {
                        type: STD.mobile.osTypeAndroid
                    },
                    order: [['id', 'DESC']],
                    limit: 1,
                    attributes: sequelize.models.MobileVersion.getMobileVersionField()
                }).then(function (data) {

                    if (data) {

                        mobileVersions[STD.mobile.osTypeAndroid] = data.version;
                        return sequelize.models.MobileVersion.findOne({
                            where: {
                                type: STD.mobile.osTypeIos
                            },
                            order: [['id', 'DESC']],
                            limit: 1,
                            attributes: sequelize.models.MobileVersion.getMobileVersionField()
                        });

                    } else {
                        return false;
                    }

                }).then(function (data) {

                    if (data) {
                        mobileVersions[STD.mobile.osTypeIos] = data.version;
                    }

                    return true;

                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(200, mobileVersions);
                    }
                });

            }
        })
    }
};