/**
 * Category model module.
 * @module app/server/models/sequelize/app-user-image
 */

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
        'userId': {
            'reference': 'User',
            'referenceKey': 'id',
            'referenceType': 'many',
            'as': 'user',
            'asReverse': 'userImages',
            'allowNull': false
        },
        'imageId': {
            'reference': 'Image',
            'referenceKey': 'id',
            'referenceType': 'one',
            'as': 'image',
            'asReverse': 'userImages',
            'allowNull': false
        },
        'createdAt': {
            'type': Sequelize.BIGINT,
            'allowNull': true
        },
        'updatedAt': {
            'type': Sequelize.BIGINT,
            'allowNull': true
        }
    },
    options: {
        'timestamps': true,
        'createdAt': false,
        'updatedAt': false,
        'charset': config.db.charset,
        'hooks': {
            'beforeCreate': mixin.options.hooks.microCreatedAt,
            'beforeBulkUpdate': mixin.options.hooks.useIndividualHooks,
            'beforeUpdate': mixin.options.hooks.microUpdatedAt
        },
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            'getIncludeUserImage': function () {
                return [{
                    'model': sequelize.models.User,
                    'as': 'user',
                    'attributes': sequelize.models.User.getUserFields()
                }, {
                    'model': sequelize.models.Image,
                    'as': 'image',
                    'attributes': sequelize.models.User.getFieldsImage()
                }];
            },
            'updateUserImages': function (body, callback) {

                if (body.imageIds !== undefined) {
                    if (body.imageIds !== null) {
                        var imageIds = body.imageIds.split(',');
                    } else {
                        var imageIds = null;
                    }
                    delete body.imageIds;
                }

                var cratedUserImages = [];

                sequelize.transaction(function (t) {

                    return sequelize.models.UserImage.destroy({
                        'where': {
                            userId: body.userId
                        },
                        'transaction': t
                    }).then(function (deleted) {

                        if (imageIds !== null) {
                            var postImages = [];
                            for (var i = 0; i < imageIds.length; i++) {
                                var temp = {
                                    userId: body.userId,
                                    imageId: imageIds[i]
                                };
                                postImages.push(temp);
                            }

                            return sequelize.models.UserImage.bulkCreate(postImages, {
                                'individualHooks': true,
                                'transaction': t
                            }).then(function (userImages) {
                                return sequelize.models.UserImage.findAll({
                                    'where': {
                                        userId: body.userId
                                    },
                                    'include': sequelize.models.UserImage.getIncludeUserImage(),
                                    'transaction': t
                                }).then(function (userImages) {
                                    cratedUserImages = userImages;
                                    return true;
                                });
                            });
                        } else {
                            return true;
                        }

                    });

                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(200, cratedUserImages);
                    }
                });
            },
            'findAppUserImagesByOption': function (options, callback) {
                var where = {};

                where.createdAt = {
                    '$lt': options.last
                };

                if (options.userId !== undefined) {
                    where.userId = options.userId;
                }

                sequelize.transaction(function (t) {

                    return sequelize.models.UserImage.findAndCountAll({
                        'offset': parseInt(options.offset),
                        'limit': parseInt(options.size),
                        'where': where,
                        'order': [[options.orderBy, options.sort]],
                        'include': sequelize.models.UserImage.getIncludeUserImage(),
                        'transaction': t
                    }).then(function (data) {
                        if (data.rows.length > 0) {
                            return data;
                        } else {
                            throw new errorHandler.CustomSequelizeError(404);
                        }
                    });

                }).catch(errorHandler.catchCallback(callback)).done(function (data) {
                    if (data) {
                        callback(200, data);
                    }
                });
            },
            'findAppUserImageById': function (id, callback) {
                var where = {};
                where.id = id;
                var query = {
                    'where': where,
                    'include': sequelize.models.UserImage.getIncludeUserImage()
                };
                sequelize.models.UserImage.findDataWithQuery(query, function (status, data) {
                    callback(status, data);
                });
            }

        })
    }
};