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
var MICRO = require('microtime-nodejs');

const profileKey = "profile";

var STD = require('../../../../bridge/metadata/standards');
var ENV = require('../../../../bridge/config/env');
var async = require('async');
var config = require('../../../../bridge/config/env');
var coreUtils = require("../../../../core/server/utils");

module.exports = {
    fields: {
        'aid': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true,
            'unique': true
        },
        'email': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true,
            'unique': true
        },
        'secret': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'salt': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': false
        },
        'phoneNum': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true,
            'unique': true
        },
        'name': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'nick': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true,
            'unique': true
        },
        'role': {
            'type': Sequelize.ENUM,
            'values': STD.user.enumRoles,
            'allowNull': false,
            'defaultValue': STD.user.roleUser
        },
        'gender': {
            'type': Sequelize.ENUM,
            'values': STD.user.enumGenders,
            'allowNull': true
        },
        'birth': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'isVerifiedEmail': {
            'type': Sequelize.BOOLEAN,
            'allowNull': false,
            'defaultValue': false
        },
        'country': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': false
        },
        'language': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': false
        },
        'isReviewed': {
            'type': Sequelize.BOOLEAN,
            'allowNull': false,
            'defaultValue': false
        },
        'agreedEmail': {
            'type': Sequelize.BOOLEAN,
            'allowNull': true
        },
        'agreedPhoneNum': {
            'type': Sequelize.BOOLEAN,
            'allowNull': true
        },
        'agreedTermsAt': {
            'type': Sequelize.BIGINT,
            'allowNull': true
        },
        'profileId': {
            'reference': 'Profile',
            'referenceKey': 'id',
            'referenceType': 'one',
            'as': 'profile',
            'asReverse': 'user',
            'onDelete': 'cascade'
        },
        'di': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'ci': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
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
        },
        'passUpdatedAt': {
            'type': Sequelize.BIGINT,
            'allowNull': true,
            'defaultValue': MICRO.now()
        }
    },
    options: {
        'indexes': [{
            unique: true,
            'SPATIAL': true,
            fields: ['nick']
        }],
        'timestamps': true,
        'charset': config.db.charset,
        'createdAt': false,
        'updatedAt': false,
        'paranoid': true, // deletedAt 추가. delete안함.
        'hooks': {
            'beforeCreate': mixin.options.hooks.microCreatedAt,
            'beforeBulkUpdate': mixin.options.hooks.useIndividualHooks,
            'beforeUpdate': mixin.options.hooks.microUpdatedAt
        },
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {
            /**
             * 이메일토큰생성
             * @returns {boolean}
             */
            'createEmailToken': function () {
                var now = new Date();
                return {
                    type: STD.user.authEmailSignup,
                    key: this.email,
                    token: crypto.randomBytes(STD.user.emailTokenLength).toString('base64'),
                    expiredAt: now.setMinutes(now.getMinutes() + STD.user.expiredEmailTokenMinutes)
                };
            },

            /**
             * 비밀번호 인코딩
             * @param {string} secret - 인코딩할 평문 비밀번호
             * @returns {boolean}
             */
            'createHashPassword': function (secret) {
                return crypto.pbkdf2Sync(secret, this.salt, 10000, 64, 'sha512').toString('base64');
            },

            /**
             * 비밀번호 검증
             * @param secret
             * @returns {boolean}
             */
            'authenticate': function (secret) {
                return this.secret == this.createHashPassword(secret);
            },

            /**
             * 비밀번호 암호화
             * @returns {mixin.options.instanceMethods}
             */
            'encryption': function () {
                this.salt = crypto.randomBytes(16).toString('base64');
                if (this.secret) this.secret = this.createHashPassword(this.secret);
                return this;
            },
            'toSecuredJSON': function () {
                var obj = this.toJSON();
                if (obj.profile) {
                    if (obj.profile.toSimpleJSON) {
                        obj.profile = obj.profile.toSimpleJSON();
                    } else {
                        delete obj.profile.userId;
                        delete obj.profile.id;
                        delete obj.profile.createdAt;
                        delete obj.profile.updatedAt;
                    }
                }
                delete obj.salt;
                delete obj.secret;
                return obj;
            },
            'toStrongSecuredJSON': function () {
                var obj = this.toSecuredJSON();
                delete obj.phoneNum;
                delete obj.email;
                return obj;
            },

            /**
             * 핸드폰번호 추가
             * @param {sequelize.models.Auth} auth - auth모델
             * @param {responseCallback} callback - 응답콜백
             */
            'addPhoneNumber': function (auth, callback) {
                var loadedUser = null;
                var self = this;
                sequelize.transaction(function (t) {
                    return self.updateAttributes({
                        phoneNum: auth.key
                    }, {transaction: t}).then(function (user) {
                        loadedUser = user;
                        return auth.destroy({transaction: t}).then(function () {

                        }).catch(errorHandler.catchCallback(callback));
                    });
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (loadedUser) {
                        callback(200, loadedUser)
                    } else {
                        callback(404);
                    }
                })
            },

            /**
             * 등록된 핸드폰번호 제거
             * @param {responseCallback} callback - 응답콜백
             */
            'removePhoneNumber': function (callback) {
                var loadedUser = null;
                var self = this;
                self.updateAttributes({
                    phoneNum: null
                }).then(function (user) {
                    loadedUser = user;
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (loadedUser) {
                        callback(200, loadedUser)
                    } else {
                        callback(404);
                    }
                });
            },

            /**
             * 이메일인증
             * @param {string} token - 토큰값
             * @param {string} type - 타입
             * @param {responseCallback} callback - 응답콜백
             * @todo testing
             */
            'verifyAuth': function (token, type, callback) {

                var isSuccess = false;
                var self = this;
                // 이미 인증되었으면 그냥 넘김.
                // 인증이 되지 않았는데 잘못된 토큰이 오면
                // 토큰을 지우고 비인증처리.
                token = token.replace(new RegExp(' ', "g"), '+');

                var now = new Date();

                // 이미 인증이 되어있다면.
                if (this.isVerifiedEmail == true) {
                    return callback(400);
                }

                sequelize.transaction(function (t) {
                    // 1. auth 체크
                    return sequelize.models.Auth.findOne({
                        where: {
                            type: type,
                            userId: self.id
                        },
                        transaction: t
                    }).then(function (auth) {

                        if (!auth) {
                            isSuccess = false;
                            throw new errorHandler.CustomSequelizeError(404);
                        }

                        if (auth.expiredAt < now || auth.token.toString() != token.toString()) {
                            isSuccess = false;
                            throw new errorHandler.CustomSequelizeError(403);
                        }

                        // 2. 인증성공하면 auth 제거
                        return auth.destroy({transaction: t}).then(function () {

                            // 3. 인증상태로 유저 변경.
                            return self.updateAttributes({
                                isVerifiedEmail: true,
                                email: auth.key
                            }, {transaction: t}).then(function (user) {
                                if (!user) {
                                    isSuccess = false;
                                    throw new errorHandler.CustomSequelizeError(404);
                                }
                                isSuccess = true;
                            });
                        });
                    });
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (isSuccess) {
                        callback(200, self);
                    }
                });
            },
            /**
             * 이메일 추가 후 인증 테이블 추가(isAutoVerifiedEmail false일경우)
             * @param email - 추가할 이메일
             * @param callback
             */
            'updateEmailAndAuth': function (email, callback) {
                var self = this;
                var updatedUser = null;
                sequelize.transaction(function (t) {
                    return sequelize.models.User.findOne({
                        where: {
                            email: email,
                            id: {
                                $ne: self.id
                            }
                        },
                        transaction: t
                    }).then(function (user) {
                        if (!user) {
                            return self.updateAttributes({
                                isVerifiedEmail: ENV.flag.isAutoVerifiedEmail,
                                email: email
                            }, {transaction: t}).then(function (user) {
                                if (!user) {
                                    updatedUser = null;
                                    throw new errorHandler.CustomSequelizeError(404);
                                }
                                updatedUser = user;

                                if (!ENV.flag.isAutoVerifiedEmail) {
                                    return sequelize.models.Auth.upsert({
                                        type: STD.user.authEmailAdding,
                                        key: email,
                                        userId: self.id
                                    }, {transaction: t}).then(function (auth) {
                                        return sequelize.models.Auth.findOne({
                                            where: {
                                                type: STD.user.authEmailAdding,
                                                key: email,
                                                userId: self.id
                                            },
                                            transaction: t
                                        }).then(function (auth) {
                                            updatedUser['auth'] = auth;
                                        });
                                    });
                                }
                            });
                        } else {
                            updatedUser = null;
                            throw new errorHandler.CustomSequelizeError(409, {
                                code: '409_5'
                            });
                        }
                    });
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    var isAutoVerifiedEmail = ENV.flag.isAutoVerifiedEmail;
                    if ((updatedUser && isAutoVerifiedEmail) ||
                        (updatedUser && updatedUser.auth && !isAutoVerifiedEmail)) {
                        callback(200, updatedUser);
                    }
                });
            },
            /**
             * 비밀번호 변경
             * @param {sequelize.models.Auth} auth - auth모델
             * @param {string} pass - 바꿀 비밀번호
             * @param {responseCallback} callback - 응답콜백
             */
            'changePassword': function (pass, callback) {
                var loadedUser = null;
                var self = this;
                self.updateAttributes({
                    secret: self.createHashPassword(pass),
                    passUpdatedAt: MICRO.now()
                }).then(function (user) {
                    if (user) {
                        loadedUser = user;
                    } else {
                        loadedUser = false;
                        throw new errorHandler.CustomSequelizeError(404);
                    }
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (loadedUser) {
                        callback(200, loadedUser);
                    }
                });
            },
            'createRandomPassword': function () {
                var length = STD.user.minSecretLength;
                var pass = "";
                for (var i = 0; i < length - 1; ++i) {
                    if ((Math.random() * 100000) % 2 == 0) {
                        pass += (Math.random() * 100000) % 10;
                    } else {
                        pass += String.fromCharCode(((Math.random() * 100000) % 26) + 97);
                    }
                }
                pass += Math.floor((Math.random() * 100000)) % 10;
                return pass;
            },
            /**
             * 아이디 패스워드 설정
             * @param type
             * @param id
             * @param pass
             * @param callback
             */
            updateUniqueAccount: function (type, id, pass, callback) {
                var self = this;
                var updatedUser = null;
                var finalStatus = null;
                sequelize.transaction(function (t) {
                    var where = {};
                    var query = {
                        where: where,
                        transaction: t
                    };
                    where.aid = id;

                    var loadedData = null;
                    return sequelize.models.User.find(query).then(function (data) {
                        loadedData = data;
                        if (!loadedData) {
                            var loadedUser = false;
                            var update = {
                                secret: self.createHashPassword(pass),
                                aid: id
                            };
                            if (type == STD.user.linkIdPassEmail) {
                                update.email = id;
                            }
                            return self.updateAttributes(update, {transaction: t}).then(function (user) {
                                if (user) {
                                    finalStatus = 200;
                                    loadedUser = user;
                                } else {
                                    finalStatus = 400;
                                }
                            });
                        } else {
                            finalStatus = 409;
                        }
                    });
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (finalStatus) {
                        return callback(finalStatus, updatedUser);
                    }
                });
            }
        }),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            'getIncludeUser': function () {
                return [{
                    model: sequelize.models.Profile,
                    as: profileKey
                }, {
                    model: sequelize.models.Provider,
                    as: 'providers',
                    attributes: sequelize.models.Provider.getProviderFields()
                }, {
                    model: sequelize.models.UserImage,
                    as: 'userImages',
                    include: [{
                        model: sequelize.models.Image,
                        as: 'image'
                    }]
                }]
            },
            'getIncludeUserWithLoginHistory': function () {
                return [{
                    model: sequelize.models.Profile,
                    as: profileKey
                }, {
                    model: sequelize.models.Provider,
                    as: 'providers',
                    attributes: sequelize.models.Provider.getProviderFields()
                }, {
                    model: sequelize.models.LoginHistory,
                    as: 'loginHistories',
                }, {
                    model: sequelize.models.UserImage,
                    as: 'userImages',
                    include: [{
                        model: sequelize.models.Image,
                        as: 'image'
                    }]
                }]
            },
            'getUserFields': function () {
                var fields = ['id', 'profileId', 'nick', 'name', 'gender', 'birth', 'role', 'country', 'language', 'agreedEmail', 'passUpdatedAt', 'deletedAt'];
                return fields;
            },
            'getFullUserFields': function () {
                var fields = ['id', 'profileId', 'email', 'phoneNum', 'nick', 'name', 'gender', 'birth', 'role', 'country', 'language', 'agreedEmail', 'agreedPhoneNum', 'passUpdatedAt', 'deletedAt'];
                return fields;
            },
            /**
             * 생성일자가 last 보다 먼저인 유저 size 만큼 찾기
             * @param {Object} last - 찾을 유저 생성일자 조건
             * @param {Object} size - 찾을 유저 수
             * @param {responseCallback} callback - 응답콜백
             */
            'findUsersByOption': function (searchItem, searchField, last, size, order, sort, roles, callback) {
                var where = {};

                var query = {
                    'limit': parseInt(size),
                    'where': where
                };

                if (searchField && searchItem) {
                    query.where[searchField] = {
                        '$like': '%' + searchItem + '%'
                    };
                } else if (searchItem) {
                    if (STD.user.enumSearchFields.length > 0) query.where.$or = [];
                    for (var i = 0; i < STD.user.enumSearchFields.length; i++) {
                        var body = {};
                        body[STD.user.enumSearchFields[i]] = {
                            '$like': '%' + searchItem + '%'
                        };
                        query.where.$or.push(body);
                    }
                }

                if (order == STD.user.orderUpdate) {
                    query.where.updatedAt = {
                        '$lt': last
                    };
                    query.order = [['updatedAt', sort]];
                } else {
                    query.where.createdAt = {
                        '$lt': last
                    };
                    query.order = [['createdAt', sort]];
                }

                if (roles !== undefined) {
                    query.where.role = roles;
                }

                query.include = [{
                    'model': sequelize.models.Profile,
                    'as': profileKey
                }];

                sequelize.models.User.findAllDataForQuery(query, callback);
            },
            /**
             * 생성일자가 last 보다 먼저인 유저 size 만큼 찾기
             * @param {Object} last - 찾을 유저 생성일자 조건
             * @param {Object} size - 찾을 유저 수
             * @param {responseCallback} callback - 응답콜백
             */
            'findAndCountUsersByOption': function (options, callback) {
                var where = {};
                var countWhere = {};
                var include;

                if (options.searchField && options.searchItem) {
                    if (options.searchField == STD.common.id) {
                        where[options.searchField] = options.searchItem;
                        countWhere[options.searchField] = options.searchItem;
                    } else {
                        where[options.searchField] = {
                            '$like': '%' + options.searchItem + '%'
                        };
                        countWhere[options.searchField] = {
                            '$like': '%' + options.searchItem + '%'
                        };
                    }
                } else if (options.searchItem) {
                    if (STD.user.enumSearchFields.length > 0) {
                        where.$or = [];
                        countWhere.$or = [];
                    }
                    for (var i = 0; i < STD.user.enumSearchFields.length; i++) {
                        var body = {};
                        if (STD.user.enumSearchFields[i] == STD.common.id) {
                            body[STD.user.enumSearchFields[i]] = options.searchItem;
                        } else {
                            body[STD.user.enumSearchFields[i]] = {
                                '$like': '%' + options.searchItem + '%'
                            };
                        }
                        where.$or.push(body);
                        countWhere.$or.push(body);
                    }
                }

                if (options.role) {
                    where.role = options.role;
                    countWhere.role = options.role;
                }

                if (options.gender) {
                    where.gender = options.gender;
                    countWhere.gender = options.gender;
                }

                if (options.orderBy == STD.user.orderUpdate) {
                    if (options.sort == STD.common.DESC) {
                        where.updatedAt = {
                            '$lt': options.last
                        };
                    } else {
                        where.updatedAt = {
                            '$gt': options.last
                        };
                    }
                    options.order = [['updatedAt', options.sort]];
                } else {
                    if (options.sort == STD.common.DESC) {
                        where.createdAt = {
                            '$lt': options.last
                        };
                    } else {
                        where.createdAt = {
                            '$gt': options.last
                        };
                    }
                    options.order = [['createdAt', options.sort]];
                }

                include = sequelize.models.User.getIncludeUserWithLoginHistory();

                var loadedUser;
                var loadedCount;

                sequelize.transaction(function (t) {

                    return sequelize.models.User.findAll({
                        'order': options.order,
                        'limit': parseInt(options.size),
                        'where': where,
                        'include': include,
                        'transaction': t
                    }).then(function (user) {
                        loadedUser = user;

                        return sequelize.models.User.count({
                            'where': countWhere
                        });
                    }).then(function (count) {
                        loadedCount = count;

                        return true;
                    });

                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {

                    if (isSuccess) {
                        var result = {
                            count: loadedCount,
                            rows: loadedUser
                        };

                        callback(200, result);
                    }
                });
            },
            /**
             * 아이디로 유저 찾기
             * @param {Object} id - 찾을 유저의 아이디
             * @param {responseCallback} callback - 응답콜백
             */
            'findUserById': function (id, callback) {
                this.findDataIncludingById(id, sequelize.models.User.getIncludeUser(), callback);
            },
            /**
             * 번호로 유저 찾기
             * @param {Object} phoneNum - 찾을 유저의 번호
             * @param {responseCallback} callback - 응답콜백
             */
            'findUserByPhoneNumber': function (phoneNum, callback) {
                var where = {phoneNum: phoneNum};
                sequelize.models.User.findDataIncluding(where, sequelize.models.User.getIncludeUser(), callback);
            },
            /**
             * 이메일로 유저 찾기
             * @param {Object} email - 찾을 유저의 이메일
             * @param {responseCallback} callback - 응답콜백
             */
            'findUserByEmail': function (email, callback) {
                var where = {email: email};
                sequelize.models.User.findDataIncluding(where, sequelize.models.User.getIncludeUser(), callback);
            },
            /**
             * AID로 유저 찾기
             * @param {Object} aid - 찾을 유저의 aid
             * @param {responseCallback} callback - 응답콜백
             */
            'findUserByAid': function (aid, callback) {
                var where = {aid: aid};
                sequelize.models.User.findDataIncluding(where, sequelize.models.User.getIncludeUser(), callback);
            },
            /**
             * nick으로 유저 찾기
             * @param {Object} aid - 찾을 유저의 aid
             * @param {responseCallback} callback - 응답콜백
             */
            'findUserByNick': function (nick, callback) {
                var where = {nick: nick};
                sequelize.models.User.findDataIncluding(where, sequelize.models.User.getIncludeUser(), callback);
            },
            /**
             * 범용 유저생성
             * @param {Object} data - 유저 생성을 위한 유저 필드
             * @param {responseCallback} callback - 응답콜백
             * @todo testing
             */
            'createUserWithType': function (data, callback) {
                data.isVerifiedEmail = ENV.flag.isAutoVerifiedEmail;
                if (data.type == STD.user.signUpTypeEmail) {

                    delete data.aid;
                    delete data.apass;

                    data.email = data.uid;
                    data.aid = data.uid;

                    delete data.provider;
                    delete data.uid;
                    this.createUserWithEmail(data, callback);
                }
                else if (data.type == STD.user.signUpTypePhone || data.type == STD.user.signUpTypePhoneId || data.type == STD.user.signUpTypePhoneEmail) {
                    data.phoneNum = data.uid;
                    delete data.provider;
                    delete data.uid;
                    this.createUserWithPhoneNumber(data, callback);
                }
                else if (data.type == STD.user.signUpTypeNormalId) {

                    delete data.aid;
                    delete data.apass;
                    delete data.email;

                    data.aid = data.uid;

                    delete data.provider;
                    delete data.uid;

                    this.createUserWithNormalId(data, callback);
                }
                else if (data.type == STD.user.signUpTypeAuthCi) {

                    data.aid = data.uid;

                    delete data.provider;
                    delete data.uid;

                    this.createUserWithAuthCi(data, callback);
                }
                else {
                    this.createUserWithProvider(data, callback);
                }
            },
            /**
             * 일반 id 가입 생성
             * @param data
             * @param callback
             */
            'createUserWithAuthCi': function (data, callback) {
                var createdUser = null;
                sequelize.transaction(function (t) {
                    var profile = sequelize.models.Profile.build({});
                    return profile.save({transaction: t}).then(function () {
                        data.profileId = profile.id;

                        var user = sequelize.models.User.build(data);
                        user.encryption();
                        return user.save({transaction: t}).then(function () {
                            createdUser = user;

                            var history = data.history;
                            return sequelize.models.LoginHistory.upsert({
                                userId: user.id,
                                type: history.type,
                                browser: history.browser,
                                platform: history.platform,
                                device: history.device,
                                version: history.version,
                                token: history.token,
                                ip: history.ip,
                                session: history.session,
                                createdAt: MICRO.now(),
                                updatedAt: MICRO.now()
                            }, {transaction: t}).then(function () {

                            });
                        });
                    }).then(function () {
                        return sequelize.models.AuthCi.destroy({
                            where: {
                                ci: createdUser.ci
                            },
                            transaction: t
                        });
                    }).then(function () {
                        return true;
                    });

                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        sequelize.models.User.findUserByAid(createdUser.aid, callback);
                    }
                });
            },
            /**
             * 일반 id 가입 생성
             * @param data
             * @param callback
             */
            'createUserWithNormalId': function (data, callback) {
                var createdUser = null;
                sequelize.transaction(function (t) {
                    var profile = sequelize.models.Profile.build({});
                    return profile.save({transaction: t}).then(function () {
                        data.profileId = profile.id;

                        var user = sequelize.models.User.build(data);
                        user.encryption();
                        return user.save({transaction: t}).then(function () {
                            createdUser = user;

                            var history = data.history;
                            return sequelize.models.LoginHistory.upsert({
                                userId: user.id,
                                type: history.type,
                                browser: history.browser,
                                platform: history.platform,
                                device: history.device,
                                version: history.version,
                                token: history.token,
                                ip: history.ip,
                                session: history.session,
                                createdAt: MICRO.now(),
                                updatedAt: MICRO.now()
                            }, {transaction: t}).then(function () {

                            });
                        });
                    });

                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (createdUser) {
                        sequelize.models.User.findUserByAid(createdUser.aid, callback);
                    }
                });
            },
            /**
             * Email 유저생성
             * @param {Object} data - 유저 생성을 위한 유저 필드
             * @param {responseCallback} callback - 응답콜백
             */
            'createUserWithEmail': function (data, callback) {
                var createdUser = null;
                var type = STD.user.authEmailSignup;

                sequelize.transaction(function (t) {
                    var profile = sequelize.models.Profile.build({});
                    return profile.save({transaction: t}).then(function () {
                        data.profileId = profile.id;

                        var history = data.history;
                        var user = sequelize.models.User.build(data);
                        user.encryption();
                        return user.save({transaction: t}).then(function () {
                            createdUser = user;

                            return sequelize.models.LoginHistory.upsert({
                                userId: user.id,
                                type: history.type,
                                browser: history.browser,
                                platform: history.platform,
                                device: history.device,
                                version: history.version,
                                token: history.token,
                                ip: history.ip,
                                session: history.session,
                                createdAt: MICRO.now(),
                                updatedAt: MICRO.now()
                            }, {transaction: t}).then(function () {
                                if (!ENV.flag.isAutoVerifiedEmail) {
                                    var authData = {
                                        type: type,
                                        key: createdUser.email,
                                        userId: user.id
                                    };
                                    return sequelize.models.Auth.upsert(authData, {transaction: t}).then(function () {

                                    });
                                }
                            });
                        });
                    });
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (createdUser) {
                        sequelize.models.User.findUserByEmail(createdUser.email, function (status, data) {
                            if (status == 200) {
                                createdUser = data;
                                if (!ENV.flag.isAutoVerifiedEmail) {
                                    sequelize.models.Auth.findDataIncluding({
                                        type: type,
                                        key: createdUser.email
                                    }, null, function (status, auth) {
                                        if (status == 200) {
                                            createdUser.auth = auth;
                                            callback(200, createdUser);
                                        } else {
                                            callback(404);
                                        }
                                    })
                                } else {
                                    callback(status, data);
                                }
                            } else {
                                callback(status, data);
                            }
                        });
                    }
                });
            },
            /**
             * Phone 유저생성
             * @param {Object} data - 유저 생성을 위한 유저 필드
             * @param {responseCallback} callback - 응답콜백
             * @todo testing
             */
            'createUserWithPhoneNumber': function (data, callback) {
                var createdUser = null;
                var authNum = data.secret;
                if (data.apass !== undefined) {
                    data.secret = data.apass;
                    delete data.apass;
                } else {
                    delete data.secret;
                }

                sequelize.transaction(function (t) {

                    
                    var profile = sequelize.models.Profile.build({});
                    return profile.save({transaction: t}).then(function () {
                        data.profileId = profile.id;

                        // 1. 유저생성.
                        var user = sequelize.models.User.build(data);
                        user.encryption();
                        return user.save({transaction: t}).then(function () {
                            createdUser = user;
                            var history = data.history;

                            var signUpType = STD.user.signUpTypePhone;
                            if (data.aid && data.apass) {
                                signUpType = STD.user.signUpTypePhoneId;
                            }

                            return sequelize.models.LoginHistory.upsert({
                                userId: user.id,
                                type: history.type,
                                browser: history.browser,
                                platform: history.platform,
                                device: history.device,
                                version: history.version,
                                token: history.token,
                                ip: history.ip,
                                session: history.session,
                                createdAt: MICRO.now(),
                                updatedAt: MICRO.now()
                            }, {transaction: t}).then(function () {
                                // 2. 번호 인증 스키마 얻기.
                                return sequelize.models.Auth.findOne({
                                    where: {
                                        type: STD.user.authPhoneSignup,
                                        key: user.phoneNum
                                    },
                                    transaction: t
                                }).then(function (auth) {

                                    if (!auth) {
                                        createdUser = null;
                                        throw new errorHandler.CustomSequelizeError(404);
                                    }
                                    var now = new Date();
                                    // 3. 번호 체크
                                    if (auth.token != authNum) {
                                        if (config.flag.isAutoVerifiedAuthPhone && process.env.NODE_ENV == 'development' && authNum == '111111') {
                                            // 4. 날짜 체크
                                            if (auth.expiredAt < now) {
                                                createdUser = null;
                                                throw  new errorHandler.CustomSequelizeError(403);
                                            } else {
                                                return auth.destroy({transaction: t}).then(function () {

                                                });
                                            }
                                        } else {
                                            createdUser = null;
                                            throw new errorHandler.CustomSequelizeError(403);
                                        }
                                    } else {
                                        // 4. 날짜 체크
                                        if (auth.expiredAt < now) {
                                            createdUser = null;
                                            throw  new errorHandler.CustomSequelizeError(403);
                                        } else {
                                            // 5. 모두 성공하면 Auth를 지움.
                                            return auth.destroy({transaction: t}).then(function () {

                                            });
                                        }
                                    }
                                });
                            });
                        });
                    });
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (createdUser) {
                        return sequelize.models.User.findUserByPhoneNumber(createdUser.phoneNum, callback);
                    }
                });
            },
            /**
             * Provider 유저생성
             * @param {Object} data - 유저 생성을 위한 유저 필드
             * @param {responseCallback} callback - 응답콜백
             * @todo testing
             */
            'createUserWithProvider': function (data, callback) {
                var createdUser = null;

                sequelize.transaction(function (t) {

                    var profile = sequelize.models.Profile.build({});
                    return profile.save({transaction: t}).then(function () {
                        data.profileId = profile.id;
                        var uid = data.uid;
                        var type = data.provider;
                        var token = data.secret;

                        delete data.uid;
                        delete data.provider;
                        delete data.secret;

                        var ip = data.ip;
                        delete  data.ip;

                        // 1. 유저생성.
                        var user = sequelize.models.User.build(data);
                        user.encryption();
                        return user.save({transaction: t}).then(function (user) {

                            var provider = sequelize.models.Provider.build({
                                type: type,
                                uid: uid,
                                token: token,
                                userId: user.id
                            });
                            provider.tokenEncryption();
                            // 2. 프로바이더생성
                            return provider.save({transaction: t}).then(function (provider) {
                                user.setDataValue('provider', provider);
                                createdUser = user;
                                var history = data.history;

                                return sequelize.models.LoginHistory.upsert({
                                    userId: user.id,
                                    type: history.type,
                                    browser: history.browser,
                                    platform: history.platform,
                                    device: history.device,
                                    version: history.version,
                                    token: history.token,
                                    ip: history.ip,
                                    session: history.session,
                                    createdAt: MICRO.now(),
                                    updatedAt: MICRO.now()
                                }, {transaction: t}).then(function () {

                                });
                            });
                        });
                    });
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (createdUser) {
                        sequelize.models.User.findUserById(createdUser.id, callback);
                    }
                });
            },
            /**
             * 소셜인증 시 가입요청, 로그인 등을 한번에 수행하는 함수.
             * @param req
             * @param loadedUser - 이미 로그인할 유저를 로드해온 적이 있다면 로드된 유저 객체를 보냄
             * @param providerData
             * @param callback
             */
            checkAccountForProvider: function (req, loadedUser, providerData, loginHistory, callback) {

                // 회원가입일 경우에 true플래그가 되며 회원가입이 아닐경우에만 (false) history를 추가한다.
                var isSignup = false;

                function login(req, user, loginHistory, callback) {

                    function loginCallback(err, callback) {
                        var bSearched = false;
                        if (err) {
                            for (var k in err) {
                                bSearched = true;
                                break;
                            }
                        }
                        if (err && bSearched) {
                            logger.e(err);
                            callback(400, err);
                        }
                        else {
                            callback(200, user);
                        }
                    }

                    if (!isSignup) {
                        req.models.LoginHistory.createLoginHistory(user.id, loginHistory, function (status, data) {
                            if (status == 200) {
                                req.login(user, function (err) {
                                    loginCallback(err, callback);
                                });
                            }
                            else {
                                callback(status, data)
                            }
                        });
                    } else {
                        // 회원가입을 통해 왔다면 이미 가입시 히스토리를 생성했음.
                        req.login(user, function (err) {
                            loginCallback(err, callback);
                        });
                    }

                }

                function signup(req, data, callback) {
                    isSignup = true;
                    sequelize.models.User.createUserWithType(data, function (status, data) {
                        if (status == 409) {
                            data.nick = data.nick + Math.floor(Math.random() * 100000) % 4;
                            return signup(req, data, callback);
                        }
                        if (status == 200) {
                            login(req, data, callback);
                        } else {
                            callback(status, data);
                        }
                    });
                }

                if (!loadedUser) {
                    sequelize.models.Provider.findDataIncluding({
                            'type': providerData.provider,
                            'uid': providerData.uid
                        }, [{
                            model: sequelize.models.User,
                            as: 'user',
                            include: sequelize.models.User.getIncludeUser()
                        }],
                        function (status, data) {
                            if (status == 200) {
                                login(req, data.user, loginHistory, callback);
                            }
                            else {
                                // 가입되어 있지 않음
                                if (STD.flag.isMoreSocialInfo) {
                                    // 더 많은 정보가 필요함. 301을 리턴해서 리다이렉트가 필요하다고 알려줌.
                                    // 페이스북등으로 가입하고 추가 데이터가 필요할때
                                    // providerData를 리턴받고 해당 값과 함께 user-post를 요청해야함.
                                    callback(301, providerData);
                                } else {
                                    // 최소 정보로 가입함, 로그인 필요.
                                    signup(req, providerData, callback);
                                }
                            }
                        }
                    );
                } else {
                    login(req, loadedUser, loginHistory, callback);
                }
            },
            destroyUserWithOtherInfo(id, callback) {
                sequelize.models.User.destroyUser(id, function (t, callback2) {
                    return sequelize.models.Report.findAll({
                        where: {},
                        transaction: t
                    }).then(function (data) {
                        console.log('destroyUserWithOtherInfo', data);
                        return callback2(t);
                    });
                }, function (status, data) {
                    callback(status, data);
                });
            },
            destroyUser: function (id, transactionFuncs, callback) {
                var self = this;

                /*
                 탈퇴시에는 모든 정보를 폐기해야한다. 단 요청에 의해서 몇개월간 개인정보를 보관해야할 필요가 있는데,
                 이럴땐 del-user 테이블을 이용하여 임시저장 처리해야한다.
                 */
                sequelize.transaction(function (t) {
                    var loadedData = null;

                    return self.findOne({
                        transaction: t,
                        where: {
                            id: id
                        },
                        include: sequelize.models.User.getIncludeUser()
                    }).then(function (data) {
                        loadedData = data;

                        var deletedUserPrefix = ENV.app.deletedUserPrefix;
                        return sequelize.models.User.update({
                            aid: deletedUserPrefix + id,
                            email: deletedUserPrefix + id,
                            phoneNum: deletedUserPrefix + id,
                            name: deletedUserPrefix + id,
                            nick: deletedUserPrefix + id,
                            ci: deletedUserPrefix + id,
                            di: deletedUserPrefix + id,
                        }, {
                            transaction: t,
                            where: {
                                id: id
                            }
                        }).then(function (data) {
                            if (data && data[0]) {

                                return sequelize.models.Provider.destroy({
                                    where: {
                                        userId: id
                                    },
                                    transaction: t
                                });

                                // var historyTasks = [];
                                // if (!loadedData.loginHistories) {
                                //     loadedData.loginHistories = [];
                                // }
                                // loadedData.loginHistories.forEach(function (history) {
                                //     historyTasks.push(history.destroy({transaction: t}));
                                // });
                                //
                                //
                                // var providerTasks = [];
                                // if (!loadedData.providers) {
                                //     loadedData.providers = [];
                                // }
                                //
                                // loadedData.providers.forEach(function (provider) {
                                //     providerTasks.push(provider.destroy({transaction: t}));
                                // });
                                //
                                // historyTasks.push(sequelize.models.Profile.destroy({
                                //     where: {
                                //         id: loadedData.profileId
                                //     },
                                //     transaction: t
                                // }));


                                // return Promise.all(historyTasks).then(function (devices) {
                                //     return Promise.all(providerTasks).then(function (providers) {
                                //         return loadedData.destroy({
                                //             where: {id: id},
                                //             cascade: true,
                                //             transaction: t
                                //         }).then(function (data) {
                                //             if (transactionFuncs) {
                                //                 return transactionFuncs(t, function (t) {
                                //                     return nextCallback(t, id, loadedData);
                                //                 });
                                //             } else {
                                //                 return nextCallback(t, id, loadedData);
                                //             }
                                //         });
                                //     });
                                // });
                            }
                        }).then(function () {
                            return sequelize.models.LoginHistory.destroy({
                                where: {
                                    userId: id
                                },
                                transaction: t
                            });
                        }).then(function () {
                            return sequelize.models.Profile.destroy({
                                where: {
                                    id: loadedData.profileId
                                },
                                transaction: t
                            });
                        }).then(function () {
                            return loadedData.destroy({
                                where: {id: id},
                                cascade: true,
                                transaction: t
                            }).then(function (data) {

                            });
                        }).then(function (data) {
                            if (transactionFuncs) {
                                return transactionFuncs(t, function (t) {
                                    return true;
                                });
                            } else {
                                return true;
                            }
                        }).then(function () {

                            // 탈퇴유저 개인정보 보관 일 수가 0보다 클때는 저장해야함.
                            if (STD.user.deletedUserStoringDay > 0) {

                                return sequelize.models.ExtinctUser.create({
                                    userId: id,
                                    data: JSON.stringify(loadedData)
                                }, {
                                    transaction: t
                                }).then(function () {
                                    return true;
                                });

                            } else {
                                return true;
                            }

                        });
                    });
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(204);
                    }
                });
            },
            'getUsersStatus': function (timeZoneOffset, year, month, day, callback) {

                //오늘 날짜 구하기
                // var today = new Date();
                // var year = today.getFullYear();
                // var month = today.getMonth() + 1;
                // var day = today.getDate();

                // var timeZoneOffset = '+09:00';

                var usersStatus = {};

                sequelize.transaction(function (t) {

                    return sequelize.models.User.count({
                        paranoid: false,
                        transaction: t
                    }).then(function (usersTotal) {
                        usersStatus.usersTotal = usersTotal;

                        return sequelize.models.User.count({
                            where: {
                                deletedAt: {
                                    $not: null
                                }
                            },
                            paranoid: false,
                            transaction: t
                        });

                    }).then(function (usersDeleted) {
                        usersStatus.usersDeletedTotal = usersDeleted;

                        var query = 'SELECT count(day) as count FROM (SELECT ' +
                            'YEAR(CONVERT_TZ(FROM_UNIXTIME(createdAt/1000000),"+00:00", "' + timeZoneOffset + '")) as year, ' +
                            'MONTH(CONVERT_TZ(FROM_UNIXTIME(createdAt/1000000),"+00:00", "' + timeZoneOffset + '")) as month, ' +
                            'DAY(CONVERT_TZ(FROM_UNIXTIME(createdAt/1000000),"+00:00", "' + timeZoneOffset + '")) as day FROM Users) as Users ' +
                            'WHERE year = ' + year + ' AND month = ' + month + ' AND day = ' + day;

                        return sequelize.query(query, {
                            type: sequelize.QueryTypes.SELECT,
                            raw: true
                        });

                    }).then(function (data) {
                        usersStatus.singUpToday = data[0].count;

                        return sequelize.models.LoginHistory.count({
                            transaction: t
                        });

                    }).then(function (count) {
                        usersStatus.loginTotal = count;

                        var query = 'SELECT count(day) as count FROM (SELECT ' +
                            'YEAR(CONVERT_TZ(FROM_UNIXTIME(updatedAt/1000000),"+00:00", "' + timeZoneOffset + '")) as year, ' +
                            'MONTH(CONVERT_TZ(FROM_UNIXTIME(updatedAt/1000000),"+00:00", "' + timeZoneOffset + '")) as month, ' +
                            'DAY(CONVERT_TZ(FROM_UNIXTIME(updatedAt/1000000),"+00:00", "' + timeZoneOffset + '")) as day FROM LoginHistories) as LoginHistories ' +
                            'WHERE year = ' + year + ' AND month = ' + month + ' AND day = ' + day;

                        return sequelize.query(query, {
                            type: sequelize.QueryTypes.SELECT,
                            raw: true
                        });

                    }).then(function (data) {
                        usersStatus.loginToday = data[0].count;

                        var query = 'SELECT count(day) as count FROM (SELECT ' +
                            'YEAR(CONVERT_TZ(deletedAt,"+00:00", "' + timeZoneOffset + '")) as year, ' +
                            'MONTH(CONVERT_TZ(deletedAt,"+00:00", "' + timeZoneOffset + '")) as month, ' +
                            'DAY(CONVERT_TZ(deletedAt,"+00:00", "' + timeZoneOffset + '")) as day FROM Users) as Users ' +
                            'WHERE year = ' + year + ' AND month = ' + month + ' AND day = ' + day;

                        return sequelize.query(query, {
                            type: sequelize.QueryTypes.SELECT,
                            raw: true
                        });

                    }).then(function (data) {
                        usersStatus.deletedUserToday = data[0].count;

                        return true;
                    });

                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(200, usersStatus);
                    }
                });

            },
            'getUsersStatusByMonth': function (timeZoneOffset, year, month, day, callback) {

                var monthKey = '_month';

                // var today = new Date();
                // var year = today.getFullYear();
                // var month = today.getMonth() + 1;

                var thisYearMonths = [];
                var lastYearMonths = [];

                for (var i = 0; i < 5; i++) {
                    if (month <= 0) {
                        lastYearMonths.push(12 + month--);
                    } else {
                        thisYearMonths.push(month--);
                    }
                }

                var thisYear = year;
                var lastYear = year - 1;

                var usersStatusByMonth = {
                    createdUsers: {},
                    deletedUsers: {}
                };

                thisYearMonths.forEach(function (thisMonth) {
                    usersStatusByMonth.createdUsers[thisMonth + monthKey] = {
                        month: thisMonth,
                        count: 0
                    };

                    usersStatusByMonth.deletedUsers[thisMonth + monthKey] = {
                        month: thisMonth,
                        count: 0
                    };
                });

                lastYearMonths.forEach(function (lastMonth) {
                    usersStatusByMonth.createdUsers[lastMonth + monthKey] = {
                        month: lastMonth,
                        count: 0
                    };
                    usersStatusByMonth.deletedUsers[lastMonth + monthKey] = {
                        month: lastMonth,
                        count: 0
                    };
                });

                var result = {
                    createdUsers: [],
                    deletedUsers: []
                };

                sequelize.transaction(function (t) {

                    var query;

                    if (lastYearMonths.length == 0) {
                        query = 'SELECT UsersByMonth.month, count(UsersByMonth.month) as count FROM ' +
                            '(SELECT YEAR(CONVERT_TZ(FROM_UNIXTIME(createdAt/1000000),"+00:00", "' + timeZoneOffset + '")) as year, MONTH(CONVERT_TZ(FROM_UNIXTIME(createdAt/1000000),"+00:00", "' + timeZoneOffset + '")) as month FROM Users) as UsersByMonth ' +
                            'WHERE year = ' + thisYear + ' AND month IN ( + ' + thisYearMonths + ') GROUP BY UsersByMonth.month ';
                    } else {
                        query = 'SELECT UsersByMonth.month, count(UsersByMonth.month) as count FROM ' +
                            '(SELECT YEAR(CONVERT_TZ(FROM_UNIXTIME(createdAt/1000000),"+00:00", "' + timeZoneOffset + '")) as year, MONTH(CONVERT_TZ(FROM_UNIXTIME(createdAt/1000000),"+00:00", "' + timeZoneOffset + '")) as month FROM Users) as UsersByMonth ' +
                            'WHERE year = ' + thisYear + ' AND month IN ( + ' + thisYearMonths + ') OR year = ' + lastYear + ' AND month IN ( + ' + lastYearMonths + ') GROUP BY UsersByMonth.month ';
                    }

                    return sequelize.query(query, {
                        type: sequelize.QueryTypes.SELECT,
                        raw: true,
                    }).then(function (createdUser) {
                        result.createdUsers = createdUser;

                        var query;

                        if (lastYearMonths.length == 0) {
                            query = 'SELECT UsersByMonth.month, count(UsersByMonth.month) as count FROM ' +
                                '(SELECT YEAR(CONVERT_TZ(deletedAt,"+00:00", "' + timeZoneOffset + '")) as year, MONTH(CONVERT_TZ(deletedAt,"+00:00", "' + timeZoneOffset + '")) as month FROM Users) as UsersByMonth ' +
                                'WHERE year = ' + thisYear + ' AND month IN ( + ' + thisYearMonths + ') GROUP BY UsersByMonth.month ';
                        } else {
                            query = 'SELECT UsersByMonth.month, count(UsersByMonth.month) as count FROM ' +
                                '(SELECT YEAR(CONVERT_TZ(deletedAt,"+00:00", "' + timeZoneOffset + '")) as year, MONTH(CONVERT_TZ(deletedAt,"+00:00", "' + timeZoneOffset + '")) as month FROM Users) as UsersByMonth ' +
                                'WHERE year = ' + thisYear + ' AND month IN ( + ' + thisYearMonths + ') OR year = ' + lastYear + ' AND month IN ( + ' + lastYearMonths + ') GROUP BY UsersByMonth.month ';
                        }

                        return sequelize.query(query, {
                            type: sequelize.QueryTypes.SELECT,
                            raw: true
                        });
                    }).then(function (deletedUser) {
                        result.deletedUsers = deletedUser;
                        return true;
                    });

                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {

                        result.createdUsers.forEach(function (createdUser) {
                            usersStatusByMonth.createdUsers[createdUser.month + monthKey] = createdUser;
                        });

                        result.deletedUsers.forEach(function (deletedUser) {
                            usersStatusByMonth.deletedUsers[deletedUser.month + monthKey] = deletedUser;
                        });

                        callback(200, usersStatusByMonth);
                    }
                });

            },
            'getUserAgeGroup': function (timeZoneOffset, callback) {

                var usersAgeGroup = {};

                sequelize.transaction(function (t) {
                    var query = 'SELECT FLOOR((YEAR(CONVERT_TZ(NOW(),"+00:00", "' + timeZoneOffset + '")) - YEAR(CONVERT_TZ(Users.birth,"+00:00", "' + timeZoneOffset + '")) + 1)/10)*10 as ageGroup, COUNT(*) as count FROM Users GROUP BY ageGroup';

                    return sequelize.query(query, {
                        type: sequelize.QueryTypes.SELECT,
                        raw: true
                    }).then(function (data) {
                        usersAgeGroup = data;
                        return true;
                    });

                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(200, usersAgeGroup);
                    }
                });

            },
            'findUserNotificationInfo': function (userId, callback) {

                var user;

                sequelize.models.User.findOne({
                    where: {
                        id: userId
                    },
                    include: [{
                        model: sequelize.models.LoginHistory,
                        as: 'loginHistories'
                    }, {
                        model: sequelize.models.NotificationSwitch,
                        as: 'notificationSwitches',
                        attributes: sequelize.models.NotificationSwitch.getUserNotificationFields()
                    }, {
                        model: sequelize.models.NotificationPublicSwitch,
                        as: 'notificationPublicSwitches',
                        attributes: sequelize.models.NotificationPublicSwitch.getUserPublicNotificationFields()
                    }]
                }).then(function (data) {
                    if (data) {
                        user = data;
                        return true;
                    } else {
                        throw new errorHandler.CustomSequelizeError(404);
                    }
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(200, user);
                    }
                });

            }
        })
    }
};