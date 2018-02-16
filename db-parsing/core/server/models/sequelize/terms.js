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
var micro = require('microtime-nodejs');
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
        'type': {
            'type': Sequelize.ENUM,
            'values': STD.terms.enumTypes,
            'allowNull': false
        },
        'title': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'language': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': false
        },
        'content': {
            'type': Sequelize.TEXT(STD.terms.contentDataType),
            'allowNull': true
        },
        'startDate': {
            'type': Sequelize.BIGINT,
            'allowNull': true
        },
        'createdAt': {
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
        'paranoid': true,
        'charset': config.db.charset,
        indexes: [{
            unique: true,
            fields: ['title', 'startDate'],
            name: 'terms_title_startDate'
        }],
        'hooks': {
            'beforeCreate': mixin.options.hooks.microCreatedAt,
            'beforeBulkUpdate': mixin.options.hooks.useIndividualHooks,
            'beforeUpdate': mixin.options.hooks.microUpdatedAt
        },
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            "findTermsByOptions": function (options, callback) {

                // var query = "SELECT result.type, result.title, result.appliedId FROM (" +
                //     "SELECT terms.type, terms.title, terms2.id as appliedId, terms.createdAt FROM (SELECT * FROM Terms WHERE deletedAt IS NULL) as terms " +
                //     "LEFT JOIN (SELECT id, startDate FROM Terms WHERE startDate <= " + micro.now() + " AND deletedAt IS NULL) as terms2 ON terms2.id = terms.id " +
                //     "WHERE terms.language = '" + options.language + "' " +
                //     "ORDER BY terms2.startDate DESC, terms.createdAt DESC) " +
                //     "result GROUP BY result.title ORDER BY result.createdAt DESC";

                var query = "SELECT b.id AS appliedId, b.title, b.type, b.startDate FROM (SELECT MAX(terms.startDate) AS startDate, terms.title, terms.language FROM Terms AS terms " +
                    "WHERE terms.startDate <= " + micro.now() + " AND terms.language = '" + options.language + "' " + " AND terms.deletedAt IS NULL " +
                    "GROUP BY terms.title) a, Terms b " +
                    "WHERE b.startDate = a.startDate " + " AND b.deletedAt IS NULL " +
                    "AND b.title = a.title " + " AND b.language = a.language " +
                    "ORDER BY b.createdAt DESC";

                sequelize.query(query).then(function (data) {
                    if (data && data[0] && data[0].length > 0) {
                        return data[0];
                    } else {
                        throw new errorHandler.CustomSequelizeError(404);
                    }
                }).catch(errorHandler.catchCallback(callback)).done(function (terms) {
                    if (terms) {
                        var body = {
                            rows: terms
                        };
                        callback(200, body);
                    }
                });
            },
            "findTermsWithTitle": function (title, callback) {

                var terms = {};

                sequelize.transaction(function (t) {

                    return sequelize.models.Terms.findAll({
                        'where': {
                            'title': title
                        },
                        'order': [['startDate', 'DESC'], ['createdAt', 'ASC']],
                        'attributes': ['id', 'startDate', 'createdAt'],
                        'transaction': t
                    }).then(function (data) {

                        if (data) {
                            terms.versions = data;

                            return sequelize.models.Terms.findById(data[data.length - 1].id, {
                                'transaction': t
                            });
                        } else {
                            throw new errorHandler.CustomSequelizeError(404);
                        }

                    }).then(function (data) {
                        terms.selected = data;
                        return true;
                    });

                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(200, terms);
                    }
                });
            },
            "findTermsById": function (id, callback) {

                var terms = {};

                sequelize.transaction(function (t) {

                    return sequelize.models.Terms.findById(id, {
                        'transaction': t
                    }).then(function (data) {

                        if (data) {
                            terms.selected = data;

                            return sequelize.models.Terms.findAll({
                                'where': {
                                    'title': data.title
                                },
                                'order': [['startDate', 'DESC'], ['createdAt', 'ASC']],
                                'attributes': ['id', 'startDate', 'createdAt'],
                                'transaction': t
                            });

                        } else {
                            throw new errorHandler.CustomSequelizeError(404);
                        }

                    }).then(function (data) {

                        if (data) {
                            terms.versions = data;
                            return true;
                        } else {
                            throw new errorHandler.CustomSequelizeError(404);
                        }

                    });

                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(200, terms);
                    }
                });
            },
            "createTerms": function (body, callback) {

                var terms = {};

                sequelize.transaction(function (t) {

                    return sequelize.models.Terms.create(body, {
                        'transaction': t
                    }).then(function (data) {

                        if (data) {
                            terms.selected = data;

                            return sequelize.models.Terms.findAll({
                                'where': {
                                    'title': data.title
                                },
                                'order': [['startDate', 'DESC'], ['createdAt', 'ASC']],
                                'attributes': ['id', 'startDate', 'createdAt'],
                                'transaction': t
                            });

                        } else {
                            throw new errorHandler.CustomSequelizeError(404);
                        }

                    }).then(function (data) {

                        if (data) {
                            terms.versions = data;
                            return true;
                        } else {
                            throw new errorHandler.CustomSequelizeError(404);
                        }

                    });

                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(200, terms);
                    }
                });

            },
            "deleteTerms": function (id, callback) {

                sequelize.transaction(function (t) {

                    return sequelize.models.Terms.findById(id, {
                        'transaction': t
                    }).then(function (data) {

                        if (data) {
                            if (data.startDate > micro.now()) {
                                return sequelize.models.Terms.update({
                                    startDate: null
                                }, {
                                    'where': {
                                        id: id
                                    },
                                    'transaction': t
                                });
                            } else {
                                throw new errorHandler.CustomSequelizeError(400, {
                                    code: '400_59'
                                });
                            }
                        } else {
                            throw new errorHandler.CustomSequelizeError(404, {
                                code: '404_11'
                            });
                        }

                    }).then(function () {

                        return sequelize.models.Terms.destroy({
                            'where': {
                                id: id
                            },
                            'transaction': t
                        });

                    }).then(function () {
                        return true;
                    });
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(204);
                    }
                });

            }
        })
    }
};