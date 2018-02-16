var app = require('../../../../app');
var should = require('should');
var models = require('../../../../bridge/models/sequelize');
var META = require('../../metadata/index');
var assert = require('assert');

describe('[Mixin method test]', function () {

    var testInstance;
    var tempInstance;
    var userInstance;

    it ('should create user', function (done) {

        userInstance = models.User.build({
            email: 'gozillacj@slogup.com',
            secret: 'qqqqqq',
            nick: 'good',
            type: META.std.user.signUpTypeEmail,
            language: 'ko',
            country: 'kr',
            ip: '192.178.11.11',
            isVerifiedEmail: false,
            salt: '123'
        });

        userInstance.create(function (status, data) {
            status.should.be.exactly(200);
            data.should.have.property('id');
            done();
        });
    });

    it('should create test model', function (done) {
        var userId = Math.floor(Math.random() * 100000) % 100000;
        var body = "test body";

        testInstance = models.Test.build({
            userId: userId,
            body: body,
            authorId: userInstance.id
        });

        testInstance.create(function (status, data) {
            status.should.be.exactly(200);
            data.should.have.property('userId', userId);
            testInstance = data;
            done();
        });
    });

    it('should update fields', function (done) {
        var modifiedBody = "modified body";
        testInstance.updateFields({
            body: modifiedBody
        }, function (status, data) {
            status.should.be.exactly(200);
            data.should.have.property('body', modifiedBody);
            done();
        });
    });

    it('should fail to find instance for raw query', function (done) {
        var raw = 'SELECT * FROM Tests WHERE id = ' + testInstance.id + 100 + ";";
        models.Test.findDataByRawQuery(raw, function (status, data) {
            status.should.be.exactly(404);
            done();
        });
    });

    it('should find instance for raw query', function (done) {
        var raw = 'SELECT * FROM Tests WHERE id = ' + testInstance.id + ";";
        models.Test.findDataByRawQuery(raw, function (status, data) {
            status.should.be.exactly(200);
            data.id.should.be.exactly(testInstance.id);
            done();
        });
    });

    it('should count instance for raw query', function (done) {
        var raw = "SELECT COUNT(*) FROM Tests WHERE id = " + testInstance.id + ";";
        models.Test.countDataWithRawQuery(raw, function (status, data) {
            status.should.be.exactly(200);
            data.should.be.exactly(1);
            done();
        });
    });

    it('should find data by id', function (done) {
        models.Test.findDataById(testInstance.id, function (status, data) {
            status.should.be.exactly(200);
            data.should.have.property('id', testInstance.id);
            done();
        });
    });

    it('should find data by id for authenticated user', function (done) {
        models.Test.findDataByAuthenticatedId(testInstance.id, 'id', testInstance.id, function (status, data) {
            status.should.be.exactly(200);
            data.should.have.property('id', testInstance.id);
            done();
        });
    });

    it('should fail to find data by id for authenticated user', function (done) {
        models.Test.findDataByAuthenticatedId(testInstance.id, 'id', testInstance.id + 1, function (status, data) {
            status.should.be.exactly(403);
            done();
        });
    });

    it('should find all data by query', function (done) {
        models.Test.findAllDataForQuery({}, function (status, data) {
            status.should.be.exactly(200);
            data.should.instanceOf(Array);
            done();
        });
    });

    it('should insert multiple data', function (done) {
        var totalCnt = 10;
        var cnt = 0;

        for (var i = 0; i < totalCnt; ++i) {
            (function () {

                var userId = 'test' + i;
                var body = "test body" + i;

                testInstance = models.Test.build({
                    userId: userId,
                    body: body,
                    authorId: userInstance.id
                });

                testInstance.create(function (status, data) {
                    status.should.be.exactly(200);
                    data.should.have.property('userId', userId);
                    testInstance = data;
                    cnt++;
                    if (cnt == totalCnt) {
                        done();
                    }
                });
            })();
        }
    });

    it('should load data for blog', function (done) {
        var load = function (last) {
            models.Test.findAllDataIncludingForBlog({}, ['id', 'createdAt'], null, 12, last, function (status, data) {
                status.should.be.within(200, 404);
                if (status == 200) {
                    data.should.instanceOf(Array);
                }
                if (status == 200) {
                    load(data[data.length - 1].createdAt);
                } else {
                    done();
                }
            });
        };
        load(new Date());
    });

    it('should load data for page', function (done) {
        var total = 0;
        var load = function (last) {
            models.Test.findAllDataIncludingForPage({}, ['id', 'createdAt'], null, 12, last, function (status, data) {
                status.should.be.within(200, 404);
                if (status == 200) {
                    data.should.instanceOf(Array);
                }
                if (status == 200) {
                    total += data.length;
                    load(total);
                } else {
                    done();
                }
            });
        };
        load(total);
    });

    it('should find data with author', function (done) {
        models.Test.findDataIncluding({
            id: testInstance.id
        }, [{
            model: models.User,
            as: 'author'
        }], function (status, data) {
            status.should.be.exactly(200);
            done();
        });
    });

    it('should find data with query', function (done) {
        models.Test.findDataWithQuery({
            where: {
                id: testInstance.id
            }
        }, function (status, data) {
            status.should.be.exactly(200);
            data.should.have.property('id', testInstance.id);
            done();
        });
    });

    it('should find all data with query', function (done) {
        models.Test.findAllDataWithQuery({
            where: {
                id: testInstance.id
            }
        }, function (status, data) {
            status.should.be.exactly(200);
            data.should.be.instanceOf(Array).lengthOf(1);
            done();
        });
    });

    it('should count data with query', function (done) {
        models.Test.countDataWithQuery({
            where: {
                id: testInstance.id
            }
        }, function (status, data) {
            status.should.be.exactly(200);
            data.should.exactly(1);
            done();
        });
    });

    it('should count data with where object', function (done) {
        models.Test.countData({
            authorId: userInstance.id
        }, function (status, data) {
            status.should.be.exactly(200);
            data.should.above(1);
            done();
        });
    });

    it('should upsert data', function (done) {
        var userId = "upsert id";
        var body = "upsert body";

        var data = {
            userId: userId,
            authorId: userInstance.id,
            body: body
        };

        var query = {
            where: data
        };

        models.Test.upsertData(data, query, function (status, data) {
            status.should.be.exactly(200);
            data.should.have.property('userId', userId);
            tempInstance = data;
            done();
        });
    });

    it('should update data by id', function (done) {
        var userId = "modified upsert id";
        var body = "modified upsert body";

        var data = {
            userId: userId,
            authorId: userInstance.id,
            body: body
        };

        models.Test.updateDataById(tempInstance.id, data, function (status, data) {
            status.should.be.exactly(204);
            done();
        });
    });

    it('should remove data by id', function (done) {
        models.Test.destroyDataById(tempInstance.id, true, function (status, data) {
            status.should.be.exactly(204);
            done();
        });
    });

    it('should remove all data', function (done) {
        models.Test.destroyData({
            authorId: userInstance.id
        }, true, function (status, data) {
            status.should.be.exactly(204);
            done();
        });
    });

    it('should remove user', function (done) {
        var rand = Math.random() * 1000000;
        userInstance.updateFields({
            nick: rand,
            email: rand,
            phoneNum: rand
        }, function (status, data) {
            userInstance.delete(function (status, data) {
                status.should.be.exactly(204);
                done();
            });
        });
    });
});
