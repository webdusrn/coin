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
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': false
        },
        'dateFolder': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': false
        },
        'name': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
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
            'getFieldsImage': function () {
                var fields = ['id', 'authorId', 'folder', 'dateFolder', 'name', 'authorized', 'createdAt', 'updatedAt', 'deletedAt'];
                return fields;
            },
            'createImages': function (array, callback) {
                var loadedImage = null;
                sequelize.models.Image.bulkCreate(array, {individualHooks: true}).then(function (data) {
                    loadedImage = data;
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (loadedImage) {
                        callback(201, loadedImage);
                    }
                });
            },
            'findImagesByObj': function (images, callback) {
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

                sequelize.models.Image.findAllDataForQuery(query, function (status, data) {
                    callback(status, data);
                });
            },
            'findImagesByOption': function (options, callback) {
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
                    if (STD.image.enumSearchFieldsUser.length > 0) userWhere.$or = [];

                    for (var i = 0; i < STD.image.enumSearchFieldsUser.length; i++) {
                        var body = {};

                        if (STD.image.enumSearchFieldsUser[i] == STD.common.id) {
                            body[STD.image.enumSearchFieldsUser[i]] = options.searchItemUser;
                        } else {
                            body[STD.image.enumSearchFieldsUser[i]] = {
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

                if (options.orderBy == STD.image.orderUpdate) {
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

                sequelize.models.Image.findAndCountAllForQuery(query, function (status, data) {
                    callback(status, data);
                });
            },
            'findImagesByIds': function (idArray, user, callback) {
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

                sequelize.models.Image.findAllDataForQuery({where: where}, function (status, data) {
                    callback(status, data);
                });
            },
            'deleteImagesByIds': function (idArray, callback) {
                var loadedImage = null;
                sequelize.models.Image.destroy({where: {id: idArray}, cascade: true}).then(function (data) {
                    loadedImage = data;
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (loadedImage) {
                        callback(204, loadedImage);
                    }
                });
            },
            'getImagesStatus': function (callback) {

                var imagesStatus = {};

                sequelize.transaction(function (t) {

                    return sequelize.models.Image.count({
                        paranoid: false,
                        transaction: t
                    }).then(function (imagesTotal) {
                        imagesStatus.total = imagesTotal;

                        return sequelize.models.Image.count({
                            where: {
                                authorized: false
                            },
                            paranoid: false,
                            transaction: t
                        });

                    }).then(function (imagesUnauthorized) {
                        imagesStatus.unauthorized = imagesUnauthorized;

                        return true;
                    });

                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(200, imagesStatus);
                    }
                });

            }
        })
    }
};