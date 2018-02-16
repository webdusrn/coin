/**
 * Profile model module.
 * @module core/server/models/sequelize/profile
 */

/**
 * 응답콜백
 * @callback responseCallback
 * @param {number} status - 상태코드
 * @param {Object} data - 성공일 경우 반환된 데이터
 */

var Sequelize = require('sequelize');
var sequelize = require('../../config/sequelize');

var mixin = require('./mixin');
var errorHandler = require('sg-sequelize-error-handler');

var STD = require('../../../../bridge/metadata/standards');
var config = require('../../../../bridge/config/env');
var coreUtils = require("../../../../core/server/utils");

module.exports = {
    'fields': { // if app have some profile items, we have to insert sequelize model in app just including field without options.
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
    'options': {
        'timestamps': true,
        'createdAt': false,
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
            updateProfile: function (update, callback) {
                var userId = update.id;
                // 유저를 먼저 찾고
                sequelize.models.User.findUserById(userId, function (status, data) {
                    var createdProfile = null;
                    if (status == 200) {
                        // 프로필아이디가 있다면 프로필 수정
                        if (data.profileId) {
                            update.id = data.profileId;
                            sequelize.models.Profile.upsert(update).then(function () {
                                createdProfile = true;
                            }).catch(errorHandler.catchCallback(callback)).done(function () {
                                if (createdProfile) {
                                    callback(200);
                                }
                            });
                        }
                        // 프로필아이디가 없으면 프로필 생성 후, 트렌젝션으로 유저의 profileId에 추가.
                        else {
                            delete update.id;
                            var profileId = "";
                            sequelize.transaction(function (t) {
                                return sequelize.models.Profile.create(update, {transaction: t}).then(function (data) {
                                    profileId = data.id;
                                    return sequelize.models.User.update({
                                        profileId: profileId
                                    }, {
                                        where: {
                                            id: userId
                                        },
                                        transaction: t
                                    }).then(function (data) {
                                        createdProfile = true;
                                    });
                                });

                            }).catch(errorHandler.catchCallback(callback)).done(function () {
                                if (createdProfile) {
                                    callback(200);
                                }
                            });
                        }
                    }
                    // 유저가 없으면 에러처리
                    else {
                        callback(status, data);
                    }
                });
            }
        })
    }
};