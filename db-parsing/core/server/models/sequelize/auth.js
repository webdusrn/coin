/**
 * Auth model module.
 * @module core/server/models/sequelize/auth
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
var config = require('../../../../bridge/config/env');
var coreUtils = require("../../../../core/server/utils");

module.exports = {
    fields: {
        'userId': {
            reference: 'User',
            referenceKey: 'id',
            as: 'user',
            asReverse: 'auths'
        },
        'type': {
            'type': Sequelize.ENUM,
            'values': STD.user.enumAuthTypes,
            'allowNull': false
        },
        'key': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': false,
            'unique': true,
            'comment': '이메일주소 혹은 휴대폰번호가 올 수 있다.'
        },
        'token': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': false
        },
        'expiredAt': {
            'type': Sequelize.DATE,
            'allowNull': false
        }
    },
    options: {
        'charset': config.db.charset,
        indexes: [{
            unique: true,
            fields: ['userId', 'type']
        }],
        'paranoid': false,
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {
            /**
             * 해당 인스턴스의 정보를 통해 토큰 값 설정.
             * @returns {*|string}
             */
            'createAuthToken': function () {
                return sequelize.models.Auth.createAuthToken(this.type);
            },

            /**
             * 해당 인스턴스의 정보를 통해 만기일 설정.
             * @returns {*}
             */
            'createExpiredDate': function () {
                return sequelize.models.Auth.createExpiredDate(this.type);
            }
        }),
        'hooks': {
            /**
             * 객체가 디비에 삽입되기전 토큰과 만기일자를 자동으로 설정 해주는 훅.
             * @param auth
             * @param options
             * @hook
             */
            'beforeValidate': function (auth, options) {
                auth.token = auth.createAuthToken();
                auth.expiredAt = auth.createExpiredDate();
            }
        },
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {

            /**
             * 인증 데이터를 upsert한다. (기존에 데이터는 지워지고 새로운 것으로 대체되기 때문에 upsert이용.)
             * @param {Object} data - type과, key값으로 이루어진 객체.
             * @param {responseCallback} callback - 응답콜백
             */
            'upsertAuth': function (data, callback) {
                var query = {where: {type: data.type, key: data.key}};
                this.upsertData(data, query, callback);
            },

            /**
             * 이메일 토큰 혹은 인증번호 생성
             * @param {enum} type - 이메일 혹은 폰번호 상수키.
             * @returns {string}
             */
            'createAuthToken': function (type) {
                if (type == STD.user.authEmailSignup || type == STD.user.authEmailFindPass) {
                    return crypto.randomBytes(STD.user.emailTokenLength).toString('base64');
                }
                else {
                    var ret = '';
                    for (var i = 0; i < STD.sms.authNumLength; ++i) {
                        ret += Math.floor(Math.random() * 9 + 1);
                    }
                    return ret + '';
                }
            },

            /**
             * 인증만료 값 얻기.
             * @param {enum} type - 이메일 혹은 폰번호 상수키.
             */
            'createExpiredDate': function (type) {
                var now = new Date();
                var min;
                if (type.toLowerCase().indexOf('email') != -1) {
                    min = STD.user.expiredEmailTokenMinutes;
                } else {
                    min = STD.user.expiredPhoneTokenMinutes;
                }
                return now.setMinutes(now.getMinutes() + min);
            },

            /**
             * 범용 토큰확인 함수.
             * @private
             * @param {enum} type - 이메일 혹은 폰번호 상수키.
             * @param {Object} where - 검색객체
             * @param {string} token - 토큰
             * @param {responseCallback} callback - 응답콜백.
             */
            checkValidToken: function (type, where, token, callback) {
                var loadedAuth = null;
                where.type = type;
                sequelize.models.Auth.findOne({where: where}).then(function (auth) {
                    loadedAuth = auth;
                }).catch(errorHandler.catchCallback(callback)).done(function() {
                    if (loadedAuth) {
                        if (loadedAuth.token != token || loadedAuth.expiredAt < new Date()) {
                            if (loadedAuth.expiredAt < new Date()) {
                                return callback(403);
                            } else {
                                if (!config.flag.isAutoVerifiedAuthPhone || process.env.NODE_ENV != 'development' || token != '111111') {
                                    return callback(403);
                                }
                            }
                        }
                        callback(200, loadedAuth);
                    } else {
                        callback(404);
                    }
                });
            }
        })
    }
};
