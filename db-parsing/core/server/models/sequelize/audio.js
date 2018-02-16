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
var config = require('../../../../bridge/config/env');
var coreUtils = require("../../../../core/server/utils");

module.exports = {
    fields: {
        'authorId': {
            'reference': 'User',
            'referenceKey': 'id',
            'referenceType': 'one',
            'as': 'author'
        },
        'folder': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'dateFolder': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'name': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'authorized': {
            'type': Sequelize.BOOLEAN,
            'allowNull': false,
            'defaultValue': true
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
        'charset': config.db.charset,
        'paranoid': true,
        'hooks': {
            'beforeCreate': mixin.options.hooks.microCreatedAt,
            'beforeBulkUpdate': mixin.options.hooks.useIndividualHooks,
            'beforeUpdate': mixin.options.hooks.microUpdatedAt
        },
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            'createAudios': function (array, callback) {
                var loadedAudio = null;
                sequelize.models.Audio.bulkCreate(array, {individualHooks: true}).then(function (data) {
                    loadedAudio = data;
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (loadedAudio) {
                        callback(201, loadedAudio);
                    }
                });
            },
            'findAudiosByObj': function (images, callback) {
                var where = {
                    '$or': []
                };

                for (var i = 0; i < images.length; i++) {
                    var body = {
                        name: {'$eq': images[i].name}
                    };
                    where.$or.push(body);
                }

                var query = {
                    'where': where
                };

                sequelize.models.Audio.findAllDataForQuery(query, function (status, data) {
                    callback(status, data);
                });
            },
            'findAudiosByOption': function (options, callback) {
                var where = {};
                var userWhere = {};

                if (options.authorId) {
                    where.authorId = options.authorId;
                }

                //이미지 필드 검색
                if (options.searchField && options.searchItem) {

                    if (options.searchField == STD.common.id) {
                        where[options.searchField] = options.searchItem;
                    } else {
                        where[options.searchField] = {
                            '$like': '%' + options.searchItem + '%'
                        };
                    }

                } else if (options.searchItem) {
                    if (STD.image.enumSearchFields.length > 0) where.$or = [];

                    for (var i = 0; i < STD.image.enumSearchFields.length; i++) {
                        var body = {};

                        if (STD.image.enumSearchFields[i] == STD.common.id) {
                            body[STD.image.enumSearchFields[i]] = options.searchItem;
                        } else {
                            body[STD.image.enumSearchFields[i]] = {
                                '$like': '%' + options.searchItem + '%'
                            };
                        }

                        where.$or.push(body);
                    }
                }

                //유저 필드 검색
                if (options.searchFieldUser && options.searchItemUser) {

                    if (options.searchFieldUser == STD.common.id) {
                        userWhere[options.searchFieldUser] = options.searchItemUser;
                    } else {
                        userWhere[options.searchFieldUser] = {
                            '$like': '%' + options.searchItemUser + '%'
                        };
                    }

                } else if (options.searchItemUser) {
                    if (STD.audio.enumSearchFieldsUser.length > 0) userWhere.$or = [];

                    for (var i = 0; i < STD.audio.enumSearchFieldsUser.length; i++) {
                        var body = {};

                        if (STD.audio.enumSearchFieldsUser[i] == STD.common.id) {
                            body[STD.audio.enumSearchFieldsUser[i]] = options.searchItemUser;
                        } else {
                            body[STD.audio.enumSearchFieldsUser[i]] = {
                                '$like': '%' + options.searchItemUser + '%'
                            };
                        }

                        userWhere.$or.push(body);
                    }
                }

                var query = {
                    'limit': parseInt(options.size),
                    'where': where,
                    'include': {
                        model: sequelize.models.User,
                        as: 'author',
                        where: userWhere
                    }
                };

                if (options.orderBy == STD.audio.orderUpdate) {
                    where.updatedAt = {
                        '$lt': options.last
                    };
                    query.order = [['updatedAt', options.sort]];
                } else {
                    where.createdAt = {
                        'lt': options.last
                    };
                    query.order = [['createdAt', options.sort]];
                }

                if (options.folder) {
                    where.folder = options.folder;
                }

                if (options.authorized !== undefined) {
                    where.authorized = options.authorized;
                }

                sequelize.models.Audio.findAndCountAllForQuery(query, function (status, data) {
                    callback(status, data);
                });
            },
            'findAudiosByIds': function (idArray, user, callback) {
                var where = {
                    id: idArray
                };

                if (user) {
                    if (user.role < STD.user.roleAdmin) {
                        where.authorId = user.id;
                    }
                } else {
                    return callback(403);
                }

                sequelize.models.Audio.findAllDataForQuery({where: where}, function (status, data) {
                    callback(status, data);
                });
            },
            'deleteAudiosByIds': function (idArray, callback) {
                var loadedAudio = null;
                sequelize.models.Audio.destroy({where: {id: idArray}, cascade: true}).then(function (data) {
                    loadedAudio = data;
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (loadedAudio) {
                        callback(204, loadedAudio);
                    }
                });
            },
            'getAudiosStatus': function (callback) {

                var audiosStatus = {};

                sequelize.transaction(function (t) {

                    return sequelize.models.Audio.count({
                        paranoid: false,
                        transaction: t
                    }).then(function (audiosTotal) {
                        audiosStatus.total = audiosTotal;

                        return sequelize.models.Audio.count({
                            where: {
                                authorized: false
                            },
                            paranoid: false,
                            transaction: t
                        });

                    }).then(function (audiosUnauthorized) {
                        audiosStatus.unauthorized = audiosUnauthorized;

                        return true;
                    });

                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(200, audiosStatus);
                    }
                });

            }
        })
    }
};