/**
 * User model module.
 * @module core/server/models/sequelize/user
 */

/**
 * 응답콜백
 * @callback responseCallback
 * @param {number} status - 상태코드
 * @param {Object} data - 성공일 경우 반환된 데이터
 */

var Sequelize = require('sequelize');
var sequelize = require('../../config/sequelize');
var crypto = require('crypto');

var mixin = require('./mixin');
var errorHandler = require('sg-sequelize-error-handler');
var STD = require('../../../../bridge/metadata/standards');
var MICRO = require('microtime-nodejs');
var config = require('../../../../bridge/config/env');
var coreUtils = require("../../../../core/server/utils");

module.exports = {
    fields: {
        'userId': {
            reference: 'User',
            referenceKey: 'id',
            as: 'user',
            asReverse: 'deletedUsers',
            allowNull: false
        },
        'data': {
            'type': Sequelize.STRING(1000),
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
        'paranoid': false, // 아예제거
        'hooks': {
            'beforeCreate': mixin.options.hooks.microCreatedAt,
            'beforeBulkUpdate': mixin.options.hooks.useIndividualHooks,
            'beforeUpdate': mixin.options.hooks.microUpdatedAt
        },
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {

        }),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            findExtinctUserByUserId: function(id, callback) {
                sequelize.models.ExtinctUser.findDataIncluding({
                    userId: id
                }, null, callback);
            },
            findAllExtinctUsers: function(size, last, callback) {
                sequelize.models.ExtinctUser.findAllDataForBlog({}, size, last, callback);
            },
            removeAllUsersInExpireDate: function(callback) {
                var now = MICRO.now();
                now = now - (STD.user.deletedUserStoringDay * 24 * 60 * 60 * 1000 * 1000);
                sequelize.models.ExtinctUser.destroyData({
                    createdAt: {
                        $lte: now
                    }
                }, null, callback)
            }
        })
    }
};