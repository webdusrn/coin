/**
 * Board model module.
 * @module core/server/models/sequelize/board
 */

var Sequelize = require('sequelize');
var sequelize = require('../../config/sequelize');
var mixin = require('./mixin');
var errorHandler = require('sg-sequelize-error-handler');

var STD = require('../../../../bridge/metadata/standards');
var config = require('../../../../bridge/config/env');
var coreUtils = require("../../../../core/server/utils");

module.exports = {
    fields: {
        'slug': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': false
        },
        'skin': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': false
        },
        'roleRead': {
            'type': Sequelize.ENUM,
            'values': STD.user.enumRoles,
            'allowNull': false,
            'defaultValue': STD.user.roleUser,
            'comment': '게시판 읽기 권한'
        },
        'roleWrite': {
            'type': Sequelize.ENUM,
            'values': STD.user.enumRoles,
            'allowNull': false,
            'defaultValue': STD.user.roleUser,
            'comment': '게시판 쓰기 권한'
        },
        'isVisible': {
            'type': Sequelize.BOOLEAN,
            'allowNull': false,
            'defaultValue': true,
            'comment': '게시판 외부 노출여부'
        },
        'isAnonymous': {
            'type': Sequelize.BOOLEAN,
            'allowNull': false,
            'defaultValue': false,
            'comment': '게시판 익명 여부'
        }
    },
    options: {
        'charset': config.db.charset,
        indexes: [{
            unique: true,
            name: 'slug',
            fields: ['slug']
        }],
        'paranoid': false,
        'hooks': {},
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            'findTestBoard': function (callback) {
                var loadedData = null;
                var query = 'SELECT * FROM Boards WHERE slug2 = "god";';
                sequelize.query(query).then(function (data) {
                    loadedData = data;
                }).nodeify(function (err, data) {
                    callback(200);
                });
            },
            'findBoardForBlog': function (role, where, size, last, callback) {
                var include = [{
                    'model': sequelize.models.Category,
                    'as': 'categories',
                    'attributes': sequelize.models.Category.getCategoryFields(),
                    'where': {
                        // roleRead: {
                        //     $lte: role || STD.user.roleUser
                        // }
                    }
                }];
                if (!role || role < STD.user.roleAdmin) {
                    where.isVisible = true;
                    include[0].where.isVisible = true;
                }
                this.findAllDataIncludingForBlog(where, null, include, size, last, callback);
            },
            'findBoardById': function (role, boardId, categoryId, callback) {
                this.findBoardByKey(role, 'id', boardId, categoryId, callback);
            },
            'findBoardByKey': function (role, key, id, categoryId, callback) {
                var where = {
                    roleRead: {
                        $lte: role || STD.user.roleUser
                    }
                };
                where[key] = id;

                var include = [{
                    'model': sequelize.models.Category,
                    'as': 'categories',
                    'attributes': sequelize.models.Category.getCategoryFields(),
                    'where': {}
                }];
                if (!role || role < STD.user.roleAdmin) {
                    where.isVisible = true;
                    include[0].where.isVisible = true;
                }
                if (categoryId) {
                    include[0].where.id = categoryId;
                }
                var query = {
                    'where': where,
                    'order': [[{'model': sequelize.models.Category, 'as': 'categories'}, 'name', 'ASC']],
                    'include': include,
                    'attributes': ''
                };
                this.findDataWithQuery(query, callback);
            },
            'findBoardBySlug': function (role, slug, categoryId, callback) {
                this.findBoardByKey(role, 'slug', slug, categoryId, callback);
            },
            'findBoardAndArticleByKey': function (role, key, id, categoryId, articleId, callback) {
                var where = {};
                where[key] = id;
                where.roleRead = {
                    $lte: role || STD.user.roleUser
                };

                var include = [{
                    'model': sequelize.models.Category,
                    'as': 'categories',
                    'attributes': sequelize.models.Category.getCategoryFields(),
                    'where': {
                        id: categoryId
                    },
                    'include': [{
                        'model': sequelize.models.Article,
                        'as': 'articles',
                        'attributes': sequelize.models.Article.getArticleFields(),
                        'where': {
                            id: articleId
                        },
                        include: [{
                            'model': sequelize.models.User,
                            'as': 'author',
                            'attributes': ['id', 'nick', 'pfimg']
                        }]
                    }]
                }];
                if (!role || role < STD.user.roleAdmin) {
                    where.isVisible = true;
                    include[0].where.isVisible = true;
                }
                var query = {
                    'where': where,
                    'include': include,
                    'attributes': ''
                };
                this.findDataWithQuery(query, callback);
            },
            'findBoardAndArticleBySlug': function (role, slug, categoryId, articleId, callback) {
                this.findBoardAndArticleByKey(role, 'slug', slug, categoryId, articleId, callback);
            },
            'findBoardAndArticleById': function (role, boardId, categoryId, articleId, callback) {
                this.findBoardAndArticleByKey(role, 'id', boardId, categoryId, articleId, callback);
            },
            'findBoardAndArticleAndCommentByKey': function (role, key, id, categoryId, articleId, commentId, callback) {
                var where = {};
                where[key] = id;
                where.roleRead = {
                    $lte: role || STD.user.roleUser
                };

                var include = [{
                    'model': sequelize.models.Category,
                    'as': 'categories',
                    'attributes': sequelize.models.Category.getCategoryFields(),
                    'where': {
                        id: categoryId
                    },
                    'include': [{
                        'model': sequelize.models.Article,
                        'as': 'articles',
                        'attributes': sequelize.models.Article.getArticleFields(),
                        'where': {
                            id: articleId
                        },
                        'include': [{
                            'model': sequelize.models.Comment,
                            'as': 'comments',
                            'attributes': sequelize.models.Comment.getCommentFields(),
                            'where': {
                                id: commentId
                            }
                        }]
                    }]
                }];
                if (!role || role < STD.user.roleAdmin) {
                    where.isVisible = true;
                    include[0].where.isVisible = true;
                    include[0].include[0].where.isVisible = true;
                }
                var query = {
                    'where': where,
                    'include': include
                };
                this.findDataWithQuery(query, callback);
            },
            'findBoardAndArticleAndCommentBySlug': function (role, slug, categoryId, articleId, commentId, callback) {
                this.findBoardAndArticleAndCommentByKey(role, 'slug', slug, categoryId, articleId, commentId, callback)
            },
            'findBoardAndArticleAndCommentById': function (role, boardId, categoryId, articleId, commentId, callback) {
                var where = {
                    id: boardId,
                    roleRead: {
                        $lte: role || STD.user.roleUser
                    }
                };
                var include = [{
                    'model': sequelize.models.Category,
                    'as': 'categories',
                    'attributes': sequelize.models.Category.getCategoryFields(),
                    'where': {
                        id: categoryId
                    },
                    'include': [{
                        'model': sequelize.models.Article,
                        'as': 'articles',
                        'attributes': sequelize.models.Article.getArticleFields(),
                        'where': {
                            id: articleId
                        },
                        'include': [{
                            'model': sequelize.models.Comment,
                            'as': 'comments',
                            'attributes': sequelize.models.Comment.getCommentFields(),
                            'where': {
                                id: commentId
                            }
                        }]
                    }]
                }];
                if (!role || role < STD.user.roleAdmin) {
                    where.isVisible = true;
                    include[0].where.isVisible = true;
                    include[0].include[0].where.isVisible = true;
                }
                var query = {
                    'where': where,
                    'include': include
                };
                this.findDataWithQuery(query, callback);
            },
            'destroyDataBySlug': function (slug, callback) {
                var isSuccess = false;
                this.destroy({where: {slug: slug}, cascade: true}).then(function () {
                    isSuccess = true;
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (isSuccess) {
                        callback(200);
                    }
                });
            },
            'updateBoardBySlug': function (slug, update, callback) {
                var loadedData = null;
                this.update(update, {
                    where: {
                        slug: slug
                    }
                }).then(function (data) {
                    loadedData = data;
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (!loadedData) return callback(404);
                    else return callback(204);
                });
            },
            'createBoardWithCategories': function (data, callback) {
                var createdBoard = null;
                var createdCategories = null;
                if (!data.categories) return callback(501);

                sequelize.transaction(function (t) {
                    return sequelize.models.Board.create(data, {transaction: t}).then(function (board) {
                        createdBoard = board;

                        var catData = [];
                        catData.boardId = board.id;
                        var catMap = {};
                        for (var i = 0; i < data.categories.length; ++i) {
                            if (!catMap[data.categories[i]]) {
                                catMap[data.categories[i]] = true;
                                catData.push({
                                    name: data.categories[i],
                                    boardId: board.id,
                                    isVisible: true
                                });
                            }
                        }
                        return sequelize.models.Category.bulkCreate(catData, {
                            transaction: t,
                            returning: true
                        }).then(function (categories) {
                            createdCategories = categories;
                        });
                    });
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (createdBoard) {
                        sequelize.models.Category.findAll({
                            where: {
                                boardId: createdBoard.id
                            },
                            attributes: sequelize.models.Category.getCategoryFields()
                        }).then(function (categories) {
                            createdCategories = categories;
                        }).catch(errorHandler.catchCallback(callback)).done(function () {
                            if (createdCategories) {
                                createdBoard.dataValues.categories = createdCategories;
                            }
                            return callback(200, createdBoard);
                        });
                    }
                });
            },
            'findBoardsByOptions': function (options, callback) {

                var include = [{
                    'model': sequelize.models.Category,
                    'as': 'categories',
                    'attributes': sequelize.models.Category.getCategoryFields(),
                    'where': {}
                }];

                var where = {};

                if (options.isVisible !== undefined) where.isVisible = options.isVisible;
                if (options.isAnonymous !== undefined) where.isAnonymous = options.isAnonymous;

                var query = {
                    'limit': parseInt(options.size),
                    'where': where
                };

                if (options.searchField) {
                    query.where[options.searchField] = {
                        '$like': "%" + searchItem + "%"
                    };
                }

                query.where.createdAt = {
                    '$lt': options.last
                };

                if (options.sort) query.order = [['createdAt', options.sort]];

                query.include = include;

                sequelize.models.Board.findAllDataForQuery(query, callback);
            }
        })
    }
};