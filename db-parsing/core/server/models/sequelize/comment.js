/**
 * Comment model module.
 * @module core/server/models/sequelize/comment
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
        'parentId': {
            reference: 'Comment',
            referenceKey: 'id',
            'as': 'parent',
            'onDelete': 'cascade',
            allowNull: false
        },
        'articleId': {
            reference: 'Article',
            referenceKey: 'id',
            'as': 'article',
            asReverse: 'comments',
            'onDelete': 'cascade',
            allowNull: false
        },
        'authorId': {
            reference: 'User',
            referenceKey: 'id',
            as: 'author',
            asReverse: 'comments',
            allowNull: false
        },
        'body': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'depth': {
            'type': Sequelize.INTEGER,
            'allowNull': false,
            'defaultValue': 0
        },
        'weight': {
            'type': Sequelize.DOUBLE,
            'allowNull': false
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
            'validate': {'min': -90, 'max': 90}
        },
        'lng': {
            'type': Sequelize.FLOAT,
            'allowNull': true,
            'validate': {'min': -180, 'max': 180}
        },
        'ip': {
            'type': Sequelize.STRING,
            'allowNull': false
        }
    },
    options: {
        'charset': config.db.charset,
        indexes: [{
            unique: true,
            fields: ['parentId', 'articleId', 'authorId'],
            name: 'comment_parent_article_author'
        }],
        'paranoid': false,
        'hooks': {},
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {
            getNextWeight: function (curDepth, prevWeight, parentWeight) {

                String.prototype.replaceAt = function (index, character) {
                    return this.substr(0, index) + character + this.substr(index + character.length);
                };

                var maxPosNumLen = STD.comment.maxPositionNumberLength;
                var maxDepth = STD.comment.maxDepth;

                if (curDepth > maxDepth) {
                    throw {
                        status: 400,
                        body: {
                            code: '400_47'
                        }
                    }
                }

                // depth가 0이라면 단순히 가중치 하나 증가
                // 최상위 댓글인 경우.
                if (curDepth === 0) {
                    if (prevWeight) return Number(prevWeight) + 1; // 1
                    else return 1; // 2
                }
                // 댓글의 댓글인 경우.
                else {
                    var integerNumber;
                    var positionNumber;

                    var startIdx = (curDepth - 1) * maxPosNumLen;
                    var max = Math.pow(10, maxPosNumLen) - 1;
                    var maxPlusOne = max + 1;

                    // 3 댓글의 댓글이고 먼저쓴게 있는경우.
                    if (prevWeight) {
                        // 먼저쓴거 그대로 갖고와서 해당 뎁스의 범위를 자르고
                        // 거기서 값을 증가시키고 다시 끼워넣어야함.
                        // 이경우 댓글의 댓글이니까 무조건 prevWeight는 소수점일 것임.
                        prevWeight += "";
                        var prevWeightArr = prevWeight.split(".");
                        integerNumber = prevWeightArr[0];
                        positionNumber = prevWeightArr[1];

                        var currentValue = positionNumber.substr(startIdx, maxPosNumLen);
                        var currentValueNumber = Number(currentValue);
                        if (currentValueNumber >= max) {
                            throw {
                                status: 400,
                                body: {
                                    code: '400_46'
                                }
                            };
                        }

                        // 한개 증가한 값을 문자열로 다시 만듬.
                        currentValue = ((maxPlusOne + currentValueNumber + 1) + "").substr(1, maxPosNumLen);
                        for (var i = startIdx; i < startIdx + maxPosNumLen; ++i) {
                            positionNumber = positionNumber.replaceAt(i, currentValue.substr(i - startIdx, 1));
                        }
                    }
                    // 댓글의 댓글인 것중 가장 처음인 경우.
                    else {
                        parentWeight += "";
                        var parentWeightArr = parentWeight.split(".");

                        // 4. 댓글의 댓글인데 처음이고, 뎁스가 1인경우
                        if (parentWeightArr.length == 1) {
                            // 상위 댓글이 소수점이 없으면 현재 뎁스는 무조건 1이여야함.
                            if (curDepth != 1) {
                                throw {
                                    status: 400
                                };
                            }
                            // 정상적인 댓글의 뎁스1의 처음 댓글.
                            else {
                                // 해당 뎁스범위를 모두 0001등으로 채우고 뎁스범위 뒤를 9999로 채움.
                                integerNumber = Number(parentWeightArr[0]) - 1;

                                var positionNumber = "";

                                //9999로 뎁스만큼 채움.
                                for (var i = 0; i < maxDepth; ++i) {
                                    positionNumber += (max + ""); //max가 9999임.
                                }

                                for (var i = 0; i < maxPosNumLen; ++i) {
                                    if (i + 1 < maxPosNumLen) {
                                        positionNumber = positionNumber.replaceAt(i, "0");
                                    } else {
                                        positionNumber = positionNumber.replaceAt(i, "1");
                                    }
                                }
                            }
                        }
                        // 5. 댓글의 댓글이고 처음이고, 뎁스가 2이상인 경우. 댓글의 댓글이 1보다 작을수는 없음. 즉 parentWeight가 소수점인 경우.
                        else {
                            // parentWeight값에서 해당 뎁스의 9999값을 0001으로 바꿔서 새로 등록.

                            // 4번과는 다르게 앞에 정수가 그대로 가야함.
                            integerNumber = Number(parentWeightArr[0]);
                            positionNumber = parentWeightArr[1];

                            for (var i = startIdx; i < startIdx + maxPosNumLen; ++i) {
                                if (i + 1 < startIdx + maxPosNumLen) {
                                    positionNumber = positionNumber.replaceAt(i, "0");
                                } else {
                                    positionNumber = positionNumber.replaceAt(i, "1");
                                }
                            }
                        }
                    }

                    integerNumber = Number(integerNumber);

                    return Number(integerNumber + "." + positionNumber);
                }
            }
        }),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            'getCommentFields': function () {
                return ['authorId', 'articleId', 'parentId', 'body', 'depth', 'weight', 'like', 'dislike', 'lat', 'lng'];
            },
            'findAllCommentsForBlog': function (articleId, authorId, size, last, callback) {
                var where = {
                    'articleId': articleId,
                    'weight': {
                        $lt: last
                    }
                };
                if (authorId) {
                    where.authorId = authorId;
                }
                var query = {
                    'where': where,
                    'limit': parseInt(size),
                    'order': [['weight', 'DESC']],
                    'include': [{
                        'model': sequelize.models.User,
                        'as': 'author',
                        'attributes': sequelize.models.User.getUserFields()
                    }]
                };
                this.findAllDataForQuery(query, callback);
            },
            'countComments': function(articleId, callback) {
                var where = {};
                where.articleId = articleId;
                this.countData(where, callback)
            },
            'countCommentsForEachArticles': function(articleIds, callback) {
                if (!articleIds || articleIds.length == 0) {
                    return callback(404, []);
                }
                var loadedData = null;
                articleIds = articleIds.join(",");
                var raw = "SELECT articleId, count(id) AS count FROM Comments WHERE articleId IN (" + articleIds + ") GROUP BY articleId;";
                sequelize.query(raw).then(function (result) {
                    if (result) {
                        loadedData = result[0];
                    }
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (loadedData) {
                        callback(200, loadedData);
                    }
                });
            },
            'createComment': function (data, parentComment, callback) {
                var createdComment = null;
                sequelize.transaction(function (t) {

                    // 뎁스 0의 최상위 댓글
                    if (!data.parentId) {

                        // 1. weight를 위해서 마지막 데이터를 락을걸고 가져온다.
                        return sequelize.models.Comment.findAll({
                            where: {},
                            limit: 1,
                            order: [['weight', 'DESC']],
                            transaction: t,
                            lock: t.LOCK.UPDATE
                        }).then(function (comments) {

                            var comment = null;
                            var firstWeight = 0;
                            if (comments.length == 1) {
                                comment = comments[0];
                                firstWeight = comment.weight;
                            }

                            // 단순히 weight를 1 증가한다.
                            data.depth = 0;
                            data.weight = Number(firstWeight) + 1;

                            var instance = sequelize.models.Comment.build(data);
                            return instance.save({
                                transaction: t
                            }).then(function () {
                                createdComment = instance;
                            });
                        });
                    }
                    // 댓글의 댓글
                    else {
                        // 같은 부모를 갖고있는 댓글들 중 최신의 댓글을 불러온다.
                        return sequelize.models.Comment.findAll({
                            where: {
                                parentId: data.parentId
                            },
                            limit: 1,
                            order: [['weight', 'DESC']],
                            transaction: t,
                            lock: t.LOCK.UPDATE
                        }).then(function (comments) {

                            var comment = null;
                            // 댓글이 없으면 최초 댓글의 댓글
                            // parentComment를 여기서만 이용함.
                            if (comments.length == 0) {
                                data.depth = parentComment.depth + 1;
                                data.weight = parentComment.getNextWeight(parentComment.depth + 1, null, parentComment.weight);
                            }
                            // 이후 댓글의 댓글
                            else {
                                comment = comments[0];
                                data.depth = comment.depth;
                                data.weight = comment.getNextWeight(comment.depth, comment.weight);
                            }

                            var instance = sequelize.models.Comment.build(data);
                            return instance.save({
                                transaction: t
                            }).then(function () {
                                createdComment = instance;
                            });
                        });
                    }
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (createdComment) {
                        callback(200, createdComment);
                    }
                });
            }
        })
    }
};