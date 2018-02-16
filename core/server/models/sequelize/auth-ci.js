/**
 * Auth-ci model module.
 * @module core/server/models/sequelize/auth-ci
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
        'ci': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': false
        },
        'di': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'transactionNo': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'name': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': false
        },
        'birthYear': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'birthMonth': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'birthDay': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'gender': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'phoneNum': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': false
        }
    },
    options: {
        "indexes": [{
            unique: true,
            fields: ['ci', 'di', 'transactionNo']
        }],
        'charset': config.db.charset,
        'paranoid': false,
        'hooks': {},
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            'upsertAuthCi': function (body, callback) {

                var authCi;

                sequelize.transaction(function (t) {

                    return sequelize.models.AuthCi.destroy({
                        where: {
                            ci: body.ci
                        },
                        transaction: t
                    }).then(function () {
                        return sequelize.models.AuthCi.create(body, {
                            transaction: t
                        });
                    }).then(function (data) {
                        authCi = data;
                        return true;
                    });

                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(200, authCi);
                    }
                });

            },
            'findOneAuthCi': function (transactionNo, callback) {

                var authCi;

                sequelize.models.AuthCi.findOne({
                    where: {
                        transactionNo: transactionNo
                    }
                }).then(function (data) {

                    if (data) {
                        authCi = data;
                        return true;
                    } else {
                        throw new errorHandler.CustomSequelizeError(404);
                    }

                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(200, authCi);
                    }
                });

            }
        })
    }
};
