/**
 * Notice model module.
 * @module core/server/models/sequelize/notice
 */


var Sequelize = require('sequelize');
var sequelize = require('../../config/sequelize');

var mixin = require('./mixin');
var errorHandler = require('sg-sequelize-error-handler');

var STD = require('../../../../bridge/metadata/standards');
var NOTICE = STD.notice;
var config = require('../../../../bridge/config/env');
var coreUtils = require("../../../../core/server/utils");

module.exports = {
    fields: {
        'title': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': false
        },
        'body': {
            'type': Sequelize.TEXT,
            'allowNull': false
        },
        'country': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'type': {
            'type': Sequelize.ENUM,
            'values': STD.notice.enumNoticeTypes,
            'allowNull': false
        },
        'startDate': {
            'type': Sequelize.BIGINT,
            'allowNull': true
        },
        'endDate': {
            'type': Sequelize.BIGINT,
            'allowNull': true
        },
        'thumbnailImageId': {
            'reference': 'Image',
            'referenceKey': 'id',
            'as': 'thumbnailImage',
            'allowNull': true
        },
        'bigImageId': {
            'reference': 'Image',
            'referenceKey': 'id',
            'as': 'bigImage',
            'allowNull': true
        },
        'smallImageId': {
            'reference': 'Image',
            'referenceKey': 'id',
            'as': 'smallImage',
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
        }
    },
    options: {
        'timestamps': true,
        'charset': config.db.charset,
        'createdAt': false,
        'updatedAt': false,
        indexes: [{
            fields: ['type'],
            name: 'notice_type'
        }],
        'paranoid': true,
        'hooks': {
            'beforeCreate': mixin.options.hooks.microCreatedAt,
            'beforeBulkUpdate': mixin.options.hooks.useIndividualHooks,
            'beforeUpdate': mixin.options.hooks.microUpdatedAt
        },
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            'findNoticesByOptions': function (options, callback) {
                var count = 0;
                var loadedData = null;
                var where = {};
                var countWhere = {};
                var query = {
                    where: where,
                    order: [['createdAt', options.sort]],
                    limit: parseInt(options.size),
                    include: [{
                        'model': sequelize.models.Image,
                        'as': 'thumbnailImage'
                    },{
                        'model': sequelize.models.Image,
                        'as': 'bigImage'
                    },{
                        'model': sequelize.models.Image,
                        'as': 'smallImage'
                    }]
                };

                if (options.offset !== undefined) {
                    query.offset = options.offset;
                }

                if (options.country !== undefined) {
                    where.country = options.country;
                    countWhere.country = options.country;
                }

                if (options.type !== undefined) {
                    where.type = options.type;
                    countWhere.type = options.type;
                }

                if (options.today !== undefined) {
                    where.startDate = {
                        '$lt': options.today
                    };
                    where.endDate = {
                        '$gt': options.today
                    };
                    countWhere.startDate = {
                        '$lt': options.today
                    };
                    countWhere.endDate = {
                        '$gt': options.today
                    };
                }

                if (options.last !== undefined) {
                    if (options.sort == STD.common.DESC) {
                        where.createdAt = {
                            '$lt': options.last
                        };
                    } else {
                        where.createdAt = {
                            '$gt': options.last
                        };
                    }
                }

                if (options.searchItem && options.searchField) {
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
                    if (STD.notice.enumFields.length) {
                        where.$or = [];
                        countWhere.$or = [];
                        STD.notice.enumFields.forEach(function (field) {
                            var body = {};
                            if (field == STD.common.id) {
                                body[field] = options.searchItem;
                            } else {
                                body[field] = {
                                    '$like': '%' + options.searchItem + '%'
                                };
                            }
                            where.$or.push(body);
                            countWhere.$or.push(body);
                        });
                    }
                }

                sequelize.models.Notice.count({
                    where: countWhere
                }).then(function (data) {
                    if (data > 0) {
                        count = data;
                        return sequelize.models.Notice.findAll(query);
                    } else {
                        throw new errorHandler.CustomSequelizeError(404);
                    }
                }).then(function (data) {
                    if (data && data.length) {
                        loadedData = data;
                        return true;
                    } else {
                        throw new errorHandler.CustomSequelizeError(404);
                    }
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(200, {
                            count: count,
                            rows: loadedData
                        });
                    }
                });
            },
            'findAllNotices': function (searchItem, searchField, last, size, country, type, sort, offset, today, callback) {

                var where = {};

                if (country) where.country = country;
                if (type) where.type = type;

                if (searchField && searchItem) {
                    if (searchField == STD.common.id) {
                        where[searchField] = searchItem;
                    } else {
                        where[searchField] = {
                            '$like': '%' + searchItem + '%'
                        };
                    }
                } else if (searchItem) {
                    if (STD.notice.enumFields.length > 0) where.$or = [];
                    for (var i = 0; i < STD.user.enumFields.length; i++) {
                        var body = {};
                        if (STD.notice.enumFields[i] == STD.common.id) {
                            body[STD.notice.enumFields[i]] = searchItem;
                        } else {
                            body[STD.notice.enumFields[i]] = {
                                '$like': '%' +searchItem + '%'
                            };
                        }
                        where.$or.push(body);
                    }
                }

                if(today){

                    where.startDate = {
                        '$lt': today
                    };

                    where.endDate = {
                        '$gt': today
                    };
                }

                where.createdAt = {
                    '$lt': last
                };

                if (!sort) sort = STD.common.DESC;

                var query = {
                    'limit': parseInt(size),
                    'offset': parseInt(offset),
                    'where': where,
                    'order': [['createdAt', sort]],
                    'include': [{
                        'model': sequelize.models.Image,
                        'as': 'thumbnailImage'
                    },{
                        'model': sequelize.models.Image,
                        'as': 'bigImage'
                    },{
                        'model': sequelize.models.Image,
                        'as': 'smallImage'
                    }]
                };

                // sequelize.models.Notice.findAllDataForQuery(query, callback);

                sequelize.models.Notice.findAndCountAll(query).then(function (data) {
                    if (data.rows.length > 0) {
                        return data;
                    } else {
                        throw new errorHandler.CustomSequelizeError(404);
                    }
                }).catch(errorHandler.catchCallback(callback)).done(function (data) {
                    if (data) {
                        callback(200, data);
                    }
                });
            }

        })
    }
};