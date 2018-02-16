/**
 * Article model module.
 * @module core/server/models/sequelize/article
 */

var Sequelize = require('sequelize');
var sequelize = require('../../config/sequelize');

var mixin = require('./mixin');
var errorHandler = require('sg-sequelize-error-handler');

var STD = require('../../../../bridge/metadata/standards');
var config = require('../../../../bridge/config/env');
var coreUtils = require("../../../../core/server/utils");

//noinspection JSAnnotator
module.exports = {
    fields: {
        'authorId': {
            reference: 'User',
            referenceKey: 'id',
            as: 'author',
            asReverse: 'articles',
            allowNull: false
        },
        categoryId: {
            reference: 'Category',
            referenceKey: 'id',
            'as': 'category',
            asReverse: 'articles',
            'onDelete': 'cascade',
            allowNull: false
        },
        'title': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': false
        },
        'body': {
            'type': Sequelize.TEXT,
            'allowNull': false
        },
        'views': {
            'type': Sequelize.INTEGER,
            'allowNull': false,
            'defaultValue': 0
        },
        'like': {
            'type': Sequelize.INTEGER,
            'allowNull': false,
            'defaultValue': 0
        },
        'dislike': {
            'type': Sequelize.INTEGER,
            'allowNull': false,
            'defaultValue': 0
        },
        'lat': {
            'type': Sequelize.FLOAT,
            'allowNull': true,
            'validate': {'min': -180, 'max': 180}
        },
        'lng': {
            'type': Sequelize.FLOAT,
            'allowNull': true,
            'validate': {'min': -180, 'max': 180}
        },
        'isNotice': {
            'type': Sequelize.BOOLEAN,
            'allowNull': false,
            'defaultValue': false
        },
        'isVisible': {
            'type': Sequelize.BOOLEAN,
            'allowNull': false,
            'defaultValue': true
        },
        'country': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': false
        },
        'ip': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': false
        },
        'img': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        }
    },
    options: {
        'charset': config.db.charset,
        'paranoid': false,
        'hooks': {},
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            'getArticleFields': function () {
                return ['authorId', 'id', 'title', 'body', 'img', 'views', 'like', 'dislike', 'lat', 'lng', 'isNotice', 'isVisible', 'country', 'updatedAt', 'createdAt'];
            },
            'findArticleById': function (articleId, callback) {
                var include = [{
                    'model': sequelize.models.User,
                    'as': 'author',
                    'attributes': ['id', 'nick', 'pfimg']
                }, {
                    'model': sequelize.models.Category,
                    'as': 'category',
                    'attributes': ['id', 'name']
                }];
                this.findDataIncludingById(articleId, include, callback);
            },
            'findAllArticlesForBlog': function (role, categoryId, nick, title, size, last, callback) {
                var where = {};
                if (categoryId instanceof Array) {
                    where.categoryId = {$in: categoryId};
                } else {
                    if (categoryId) {
                        where.categoryId = categoryId;
                    }
                }
                if (!role || role < STD.user.roleAdmin) {
                    where.isVisible = true;
                }
                var include = [{
                    'model': sequelize.models.User,
                    'as': 'author',
                    'attributes': ['id', 'nick', 'pfimg']
                }, {
                    'model': sequelize.models.Category,
                    'as': 'category',
                    'attributes': ['id', 'name']
                }];

                if (nick) {
                    include[0].where = {
                        nick: {$like: "%" + nick + "%"}
                    }
                }

                if (title) {
                    where.title = {$like: "%" + title + "%"};
                }

                var attributes = ['id', 'title', 'body', 'views', 'like', 'dislike', 'isNotice', 'isVisible', 'createdAt'];
                this.findAllDataIncludingForBlog(where, attributes, include, size, last, callback);
            },
            'findAllArticlesAndNoticeArticlesForPage': function (role, categoryId, isNotice, nick, title, size, last, callback) {
                var where = {};
                if (categoryId instanceof Array) {
                    where.categoryId = {$in: categoryId};
                } else {
                    if (categoryId) {
                        where.categoryId = categoryId;
                    }
                }
                if (!role || role < STD.user.roleAdmin) {
                    where.isVisible = true;
                }
                where.isNotice = isNotice;
                var include = [{
                    'model': sequelize.models.User,
                    'as': 'author',
                    'attributes': ['id', 'nick', 'pfimg']
                }, {
                    'model': sequelize.models.Category,
                    'as': 'category',
                    'attributes': ['id', 'name']
                }];
                if (nick) {
                    include[0].where = {
                        nick: {$like: "%" + nick + "%"}
                    }
                }
                if (title) {
                    where.title = {$like: "%" + title + "%"};
                }
                var attributes = sequelize.models.Article.getArticleFields();
                this.findAllDataIncludingForPage(where, attributes, include, size, last, callback);
            },
            'findAllNoticeArticlesForPage': function(role, categoryId, callback) {
                this.findAllArticlesAndNoticeArticlesForPage(role, categoryId, true, null, null, STD.article.maxNoticeLength, 0, callback);
            },
            'findAllArticlesForPage': function (role, categoryId, nick, title, size, last, callback) {
                this.findAllArticlesAndNoticeArticlesForPage(role, categoryId, false, nick, title, size, last, callback);
            },
            'countArticles': function (role, categoryId, isNotice, nick, title, callback) {
                if (nick !== undefined) {
                    var raw = "SELECT COUNT(article.id) " +
                        "FROM Articles AS article INNER JOIN Users AS user " +
                        "ON article.authorId = user.id AND user.nick LIKE '" + "%" + nick + "%" + "' AND user.deletedAt IS NULL";

                    if (isNotice === true || isNotice === false) {
                        raw += " AND isNotice = " + isNotice;
                    }

                    if (categoryId instanceof Array) {
                        raw += " AND article.categoryId IN (" + categoryId.join(",") + ")";
                    }  else if (categoryId) {
                        raw += " AND article.categoryId = " + categoryId;
                    }

                    //raw = sequelize.getQueryInterface().escape(raw);

                    this.countDataWithRawQuery(raw, callback);
                }
                else {
                    var where = {};
                    if (categoryId instanceof Array) {
                        where.categoryId = {$in: categoryId};
                    }  else if (categoryId) {
                        where.categoryId = categoryId;
                    }
                    if (isNotice === true || isNotice === false) {
                        where.isNotice = isNotice;
                    }
                    if (title !== undefined) {
                        where.title = {$like: "%" + title + "%"};
                    }
                    if (!role || role < STD.user.roleAdmin) {
                        where.isVisible = true;
                    }
                    this.countData(where, callback)
                }
            }
        })
    }
};