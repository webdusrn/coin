/**
 * Provider model module.
 * @module core/server/models/sequelize/provider
 */

var Sequelize = require('sequelize');
var sequelize = require('../../config/sequelize');
var crypto = require('crypto');
var mixin = require('./mixin');
var errorHandler = require('sg-sequelize-error-handler');

var STD = require('../../../../bridge/metadata/standards');
var ENV = require('../../../../bridge/config/env');
var socialValidator = require('../../utils/social-validator');
var config = require('../../../../bridge/config/env');
var coreUtils = require("../../../../core/server/utils");

module.exports = {
    fields: {
        'userId': {
            reference: 'User',
            referenceKey: 'id',
            as: 'user',
            asReverse: 'providers',
            allowNull: false,
            onDelete: 'cascade'
        },
        'type': {
            'type': Sequelize.ENUM,
            'values': STD.user.enumProviders,
            'allowNull': false
        },
        'uid': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': false
        },
        'token': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': false
        },
        'salt': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': false
        }
    }, options: {
        'charset': config.db.charset,
        'paranoid': false,
        indexes: [{
            unique: true,
            fields: ['userId', 'type']
        }, {
            unique: true,
            fields: ['type', 'uid']
        }],
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {
            'tokenAuthenticate': function (token) {
                return this.token == this.createHashPassword(token);
            },
            'createHashToken': function (token) {
                return crypto.pbkdf2Sync(token, this.salt, 15000, 64, 'sha512').toString('base64');
            },
            'tokenEncryption': function () {
                this.salt = crypto.randomBytes(20).toString('base64');
                this.token = this.createHashToken(this.token);
                return this;
            }
        }),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            getProviderFields: function () {
                var fields = ['id', 'type', 'uid'];
                return fields;
            },
            updateToken: function (type, userId, uid, secret, callback) {
                socialValidator[type + 'Validadtor'](uid, secret, function (status, data) {
                    if (status == 200) {
                        var createdProvider = null;
                        // var provider = sequelize.models.Provider.build({
                        //     type: type,
                        //     uid: uid,
                        //     token: secret,
                        //     userId: userId
                        // });
                        // provider.tokenEncryption();
                        //
                        // // 2. 프로바이더생성
                        // return provider.save().then(function (data) {
                        //     if (data) {
                        //         createdProvider = data;
                        //     }
                        // });

                        sequelize.transaction(function (t) {

                            return sequelize.models.Provider.findOne({
                                where: {
                                    userId: userId,
                                    type: type
                                },
                                transaction: t
                            }).then(function (data) {
                                if (data) {
                                    throw new errorHandler.CustomSequelizeError(409, {
                                        code: '409_4'
                                    });
                                } else {
                                    return sequelize.models.Provider.findOne({
                                        where: {
                                            type: type,
                                            uid: uid
                                        },
                                        transaction: t
                                    });
                                }
                            }).then(function (data) {
                                if (data) {
                                    throw new errorHandler.CustomSequelizeError(409, {
                                        code: '409_8'
                                    });
                                } else {
                                    // return sequelize.models.Provider.create({
                                    //     type: type,
                                    //     uid: uid,
                                    //     token: secret,
                                    //     userId: userId
                                    // }, {
                                    //     transaction: t
                                    // });

                                    var provider = sequelize.models.Provider.build({
                                        type: type,
                                        uid: uid,
                                        token: secret,
                                        userId: userId
                                    });

                                    provider.tokenEncryption();

                                    return provider.save({
                                        transaction: t
                                    });
                                }
                            }).then(function (data) {
                                createdProvider = data;

                            });

                        }).catch(errorHandler.catchCallback(callback)).done(function () {
                            if (createdProvider) {
                                callback(200, createdProvider);
                            }
                        });

                    } else {
                        callback(status, data);
                    }
                });
            },
            checkAndRefreshToken: function (type, uid, secret, callback) {
                socialValidator[type + 'Validadtor'](uid, secret, function (status, data) {
                    if (status == 200) {
                        sequelize.models.Provider.updateDataByKey('uid', uid, {
                            uid: uid,
                            token: secret
                        }, function (status, data) {
                            if (status == 404 || status == 204) {
                                callback(200);
                            } else {
                                callback(status, data);
                            }
                        });
                    } else {
                        callback(status, data);
                    }
                });
            }
        })
    }
};

