/**
 * Mixin model helper.
 * @mixin
 */


var Sequelize = require('sequelize');
var sequelize = require('../../config/sequelize');
var errorHandler = require('sg-sequelize-error-handler');
var STD = require('../../../../bridge/metadata/standards');
var MICRO = require('microtime-nodejs');

var mixin = {
    'options': {
        'instanceMethods': {
            /**
             * 해당 인스턴스의 객체를 디비와 동기화
             * @param callback
             */
            'create': function (callback) {
                var t = false;
                var loadedData = false;
                var self = this;
                self.save().then(function (data) {
                    t = true;
                    loadedData = data;
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (t) {
                        if (loadedData) {
                            return callback(200, loadedData);
                        } else {
                            return callback(404, loadedData);
                        }
                    }
                });
            },

            /**
             * 해당 업데이트된 인스턴스의 객체를 서버와 동기화
             * @param update
             * @param callback
             */
            'updateFields': function (update, callback) {
                var t = false;
                var loadedData = false;
                this.updateAttributes(update).then(function (data) {
                    t = true;
                    loadedData = data;
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (t) {
                        if (loadedData) {
                            return callback(200, loadedData);
                        } else {
                            return callback(404);
                        }
                    }
                });
            },

            /**
             * 해당 인스턴스를 서버에서 제거
             * @param callback - 성공시 204
             */
            'delete': function (callback) {
                var t = false;
                this.destroy().then(function (data) {
                    t = true;
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (t) {
                        return callback(204);
                    }
                });
            }
        },
        'classMethods': {
            /**
             * 생성시 include 포함해서 반환
             * @param body
             * @param include
             * @param callback
             */
            'createDataIncluding': function (body, include, callback) {
                var createdData = null;
                this.create(body, {
                    include: include
                }).then(function (data) {
                    createdData = data;
                    return true;
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(201, createdData);
                    }
                });
            },
            /**
             * raw 쿼리를 통해서 데이터를 찾음
             * @param raw
             * @param Model
             * @param callback
             * @todo sql injection
             */
            'findDataByRawQuery': function (raw, callback) {
                var loadedData = null;
                var transModel = {
                    model: this
                };
                sequelize.query(raw, transModel).then(function (result) {
                    if (result && ((result instanceof Array) && result.length > 0)) {
                        loadedData = result[0];
                    } else {
                        loadedData = 'not found';
                    }
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (loadedData && loadedData != 'not found') {
                        callback(200, loadedData);
                    } else if (loadedData == 'not found') {
                        callback(404);
                    }
                });
            },

            /**
             * 로우쿼리를 통해서 카운팅
             * @param raw
             * @param callback
             * @todo sql injection
             */
            'countDataWithRawQuery': function (raw, callback) {
                var count = null;
                sequelize.query(raw).then(function (result) {
                    for (var k in result[0][0]) {
                        count = result[0][0][k];
                    }
                    count = Number(count);
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (count || count === 0) {
                        callback(200, count);
                    }
                });
            },

            /**
             * 아이디를 통해서 데이터 조회
             * @param id
             * @param callback
             */
            'findDataById': function (id, callback) {
                var t = false;
                var loadedData = null;
                this.findById(id).then(function (data) {
                    t = true;
                    loadedData = data;
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (t) {
                        if (loadedData) {
                            callback(200, loadedData);
                        } else {
                            callback(404);
                        }
                    }
                });
            },

            /**
             * 데이터를 조회하는데 해당 객체의 키값과 파라미터의 아이디가 같아야 성공
             * @param id
             * @param key
             * @param userId
             * @param callback
             */
            'findDataByAuthenticatedId': function (id, key, userId, callback) {
                this.findDataById(id, function (status, data) {
                    if (status == 200) {
                        if (!userId) {
                            return callback(200, data);
                        }

                        if (data[key] == userId) {
                            callback(200, data);
                        } else {
                            callback(403, data);
                        }
                    } else {
                        callback(status, data);
                    }
                });
            },

            /**
             * 여러 데이터를 조회
             * @param query
             * @param callback
             */
            'findAllDataForQuery': function (query, callback) {
                var t = false;
                var loadedData = null;
                this.findAll(query).then(function (data) {
                    t = true;
                    loadedData = data;
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (t) {
                        if (loadedData && loadedData.length > 0) {
                            return callback(200, loadedData);
                        } else {
                            return callback(404);
                        }
                    }
                });
            },

            /**
             * 여러 데이터를 조회
             * @param query
             * @param callback
             */
            'findAndCountAllForQuery': function (query, callback) {
                var t = false;
                var loadedData = null;
                this.findAndCountAll(query).then(function (data) {
                    t = true;
                    loadedData = data;
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (t) {
                        if (loadedData && loadedData.rows.length > 0) {
                            return callback(200, loadedData);
                        } else {
                            return callback(404);
                        }
                    }
                });
            },

            /**
             * 여러 데이터를 조회하는데 블로그 형태를 통해 조회 (last값이 마지막 데이터의 생성날짜가옴.)
             * @param where
             * @param attributes
             * @param include
             * @param size
             * @param last
             * @param callback
             * @todo solving date precision
             */
            'findAllDataIncludingForBlog': function (where, attributes, include, size, last, callback) {
                where.createdAt = {
                    '$lt': last
                };
                var query = {
                    'where': where,
                    'limit': parseInt(size),
                    'order': [['createdAt', 'DESC']],
                    'attributes': attributes,
                    'include': include
                };

                if (!attributes || attributes.length == 0) delete query.attributes;
                if (!include) delete query.include;

                this.findAllDataForQuery(query, callback);
            },

            /**
             * 여러 데이터를 조회하는데 게시판 페이지 형태를 통해서 조회 (last값이 데이터 개수를 의미함)
             * @param where
             * @param attributes
             * @param include
             * @param size
             * @param last
             * @param callback
             */
            'findAllDataIncludingForPage': function (where, attributes, include, size, last, callback) {
                var t = false;
                var loadedData = null;
                var query = {
                    'where': where,
                    'limit': parseInt(size),
                    'offset': parseInt(last),
                    'attributes': attributes,
                    'order': [['createdAt', 'DESC']],
                    'include': include
                };

                if (!attributes || attributes.length == 0) delete query.attributes;
                if (!include) delete query.include;

                this.findAll(query).then(function (data) {
                    t = true;
                    loadedData = data;
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (t) {
                        if (loadedData) {
                            callback(200, loadedData);
                        } else {
                            callback(404);
                        }
                    }
                });
            },

            /**
             * 블로그형식을 통해서 여러 데이터를 조회
             * @param where
             * @param size
             * @param last
             * @param callback
             */
            'findAllDataForBlog': function (where, size, last, callback) {
                this.findAllDataIncludingForBlog(where, null, null, size, last, callback);
            },

            /**
             * 페이지 형식을 통해서 여러 데이터를 조회
             * @param where
             * @param size
             * @param last
             * @param callback
             */
            'findAllDataForPage': function (where, size, last, callback) {
                this.findAllDataIncludingForPage(where, null, null, size, last, callback);
            },

            /**
             * include값을 포함하여 데이터 조회
             * @param where - {where:{}}
             * @param include - [{model: sequelize.models.Profile, as: 'profile'}]
             * @param callback
             */
            'findDataIncluding': function (where, include, callback) {
                var loadedData = null;
                var t = false;

                var query = {
                    where: where
                };
                if (include) {
                    query.include = include;
                }
                this.find(query).then(function (data) {
                    t = true;
                    loadedData = data;
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (t) {
                        if (loadedData) {
                            callback(200, loadedData);
                        } else {
                            callback(404);
                        }
                    }
                });
            },

            /**
             * include값을 포함한 데이터를 id 값을 이용하여 조회
             * @param id
             * @param include
             * @param callback
             */
            'findDataIncludingById': function (id, include, callback) {
                this.findDataIncluding({id: id}, include, callback);
            },

            /**
             * 쿼리객체를 통해서 데이터 조회
             * @param query
             * @param callback
             */
            'findDataWithQuery': function (query, callback) {
                var loadedData = null;
                var t = false;

                this.find(query).then(function (data) {
                    t = true;
                    loadedData = data;
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (t) {
                        if (loadedData) {
                            callback(200, loadedData);
                        } else {
                            callback(404);
                        }
                    }
                });
            },

            /**
             * 쿼리객체를 통해서 여러 데이터 조회
             * @param query
             * @param callback
             */
            'findAllDataWithQuery': function (query, callback) {
                var loadedData = null;
                var t = false;
                this.findAll(query).then(function (data) {
                    t = true;
                    loadedData = data;
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (t) {
                        if (loadedData && loadedData.length > 0) {
                            return callback(200, loadedData);
                        } else {
                            return callback(404);
                        }
                    }
                });
            },

            /**
             * 쿼리 객체를 통해서 카운팅
             * @param query
             * @param callback
             */
            'countDataWithQuery': function (query, callback) {
                var self = this;
                var counter = null;
                var t = false;
                self.count(query).then(function (count) {
                    t = true;
                    counter = count;
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (t) {
                        if (counter >= 0) {
                            callback(200, counter);
                        } else {
                            callback(404);
                        }
                    }
                });
            },

            /**
             * where객체를 통해서 데이터 카운팅
             * @param where
             * @param callback
             */
            'countData': function (where, callback) {
                var self = this;
                var counter = null;
                var t = false;
                self.count({where: where}).then(function (count) {
                    t = true;
                    counter = count;
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (t) {
                        if (counter >= 0) {
                            callback(200, counter);
                        } else {
                            callback(404);
                        }
                    }
                });
            },

            /**
             * 데이터 upserting
             * @param data
             * @param query
             * @param callback
             */
            'upsertData': function (data, query, callback) {
                var createdData = null;
                var self = this;
                var t = false;
                self.upsert(data).catch(errorHandler.catchCallback(callback)).done(function () {
                    self.findOne(query).then(function (data) {
                        createdData = data;
                        t = true;
                    }).catch(errorHandler.catchCallback(callback)).done(function () {
                        if (t) {
                            if (createdData) {
                                callback(200, createdData);
                            } else {
                                callback(404);
                            }
                        }
                    });
                });
            },

            'updateDataWithQuery': function (selector, update, callback) {
                var loadedData = false;
                var t = false;
                this.update(update, selector).then(function (data) {
                    t = true;
                    loadedData = data && data[1][0];
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (t) {
                        if (loadedData) {
                            callback(200, loadedData);
                        } else {
                            callback(404);
                        }
                    }
                });
            },

            /**
             * 아이디를 통해서 데이터 없데이트
             * @param id
             * @param update
             * @param callback - 성공시 204
             */
            'updateDataById': function (id, update, callback) {
                var loadedData = null;
                var t = false;
                this.update(update, {
                    where: {
                        id: id
                    }
                }).then(function (data) {
                    t = true;
                    loadedData = data && data[0];
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (t) {
                        if (loadedData) {
                            callback(204);
                        } else {
                            callback(404);
                        }
                    }
                });
            },

            /**
             * 아이디를 통해서 데이터 없데이트 후 객체 리턴
             * @param id
             * @param update
             * @param callback - 성공시 200
             */
            'updateDataByIdAndReturnData': function (id, update, callback) {
                var loadedData = null;
                this.update(update, {
                    where: {
                        id: id
                    }
                }).then(function (data) {
                    t = true;
                    if (data && data[0] > 0) {
                        loadedData = data[1][0];
                        return true;
                    } else {
                        throw new errorHandler.CustomSequelizeError(404);
                    }
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (loadedData) {
                        callback(200, loadedData);
                    }
                });
            },

            /**
             * 아이디를 통해서 데이터 없데이트 후 객체 리턴
             * @param id
             * @param update
             * @param callback - 성공시 200
             */
            'updateDataIncludingByIdAndReturnData': function (id, update, include, callback) {
                var loadedData = null;
                this.update(update, {
                    where: {
                        id: id
                    }
                }).then(function (data) {
                    if (data && data[0] > 0) {

                        this.find({
                            where: {
                                id: id
                            },
                            include: include
                        });

                    } else {
                        throw new errorHandler.CustomSequelizeError(404);
                    }
                }).then(function (data) {
                    if (data) {
                        loadedData = data;
                        return true;
                    } else {
                        throw new errorHandler.CustomSequelizeError(404);
                    }
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (loadedData) {
                        callback(200, loadedData);
                    }
                });

            },

            /**
             * 아이디를 통해서 데이터 없데이트
             * @param key - 임의의 find에 필요한 키
             * @param field - 임의의 find에 필요한 값
             * @param update
             * @param callback - 성공시 204
             */
            'updateDataByKey': function (key, field, update, callback) {
                var loadedData = false;
                var updateOptions = {
                    where: {}
                };
                var t = false;
                updateOptions.where[key] = field;
                this.update(update, updateOptions).then(function (data) {
                    loadedData = data && data[0];
                    t = true;
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (t) {
                        if (loadedData) {
                            callback(204);
                        } else {
                            callback(404);
                        }
                    }
                });
            },

            /**
             * 아이디를 통해서 데이터 제거
             * @param id
             * @param callback - 성공시 204
             */
            'destroyDataById': function (id, cascade, callback) {
                var isSuccess = false;
                this.destroy({where: {id: id}, cascade: cascade}).then(function (data) {
                    isSuccess = true;
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (isSuccess) {
                        return callback(204);
                    }
                });
            },

            /**
             * where객체를 통해서 데이터 제거
             * @param where
             * @param callback - 성공시 204
             */
            'destroyData': function (where, cascade, callback) {
                var isRemoved = false;
                this.destroy({
                    where: where,
                    cascade: cascade
                }).then(function () {
                    isRemoved = true;
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (isRemoved) {
                        callback(204);
                    }
                });
            }
        },
        'hooks': {
            /**
             * timestamps: false
             * 데이터 만들시 createdAt, updatedAt, deletedAt field 추가, type: sequelize.DATE(3) - millisecond
             * MySQL의 now함수를 불러와서 사용. (millisecond 까지 생성) - javascript 적용 가능
             */
            'milliCreatedAt': function (instance, options, fn) {
                instance.set("createdAt", sequelize.fn("NOW", 3));
                instance.set("updatedAt", sequelize.fn("NOW", 3));
                return fn(null, instance);
            },
            /**
             * 데이터 수정시 updatedAt 변경 (milliseconds)
             */
            'milliUpdatedAt': function (instance, options, fn) {
                if (!instance._changed.updatedAt) {
                    instance.updateAttributes({updatedAt: sequelize.fn("NOW", 3)});
                }
                return fn(null, instance);
            },
            'milliDeletedAt': function (instance, options, fn) {
                if (!instance._changed.deletedAt) {
                    instance.updateAttributes({deletedAt: sequelize.fn("NOW", 3)});
                }
                return fn(null, instance);
            },
            /**
             * 데이터 만들시 createdAtMicro와 updatedAtMicro 추가(microseconds)
             * @condition model 정의시 createdAtMicro, updatedAtMicro의 type: sequelize.BIGINT - 64bit int
             */
            'microCreatedAt': function (instance, options, fn) {
                instance.set("createdAt", MICRO.now());
                instance.set("updatedAt", MICRO.now());
                return fn(null, instance);
            },
            /**
             * Bulk 데이터 수정시 beforeUpdate 호출을 위한 속성 변경
             */
            'useIndividualHooks': function (options) {
                options.individualHooks = true;
            },
            /**
             * 데이터 수정시 updatedAtMicro 변경 (microseconds)
             */
            'microUpdatedAt': function (instance, options, fn) {
                instance.set("updatedAt", MICRO.now());
                return fn(null, instance);
            },
            'microDeletedAt': function (instance, options, fn) {
                instance.set("deletedAt", MICRO.now());
                return fn(null, instance);
            }
        }
    }
};

module.exports = mixin;
