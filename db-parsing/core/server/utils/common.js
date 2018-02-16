var META = require('../../../bridge/metadata/index');
var CODES = META.codes;
var fs = require('fs');
var path = require('path');
var async = require('async');
var Logger = require('sg-logger');
var logger = new Logger(__filename);

module.exports = {
    getAPIParams: function (url, method) {
        var api = this.getAPI(url);
        if (api) {
            return api[method](true)();
        } else {
            return {};
        }
    },
    getAPI: function (url) {
        function getApiPath(isCore, group, resource) {
            if (isCore) {
                return require('path').resolve(__dirname, '../apis/' + group + '/' + resource + '/' + resource + ".assembly.js");
            } else {
                return require('path').resolve(__dirname, '../../../app/server/apis/' + group + '/' + resource + '/' + resource + ".assembly.js");
            }
        }

        var apiResource = url;
        var resourceArr = apiResource.split("/");
        var startIdx = 0;
        if (resourceArr[0] == "") {
            startIdx = 1;
        }
        var group = resourceArr[startIdx++];
        var resource = resourceArr[startIdx];

        var isAppExists = fs.existsSync(getApiPath(false, group, resource));
        var isCoreExists = false;
        if (!isAppExists) {
            isCoreExists = fs.existsSync(getApiPath(true, group, resource));
        }
        if (!isCoreExists && !isAppExists) {
            return null;
        } else {
            var path = getApiPath(true, group, resource);
            if (isAppExists) {
                path = getApiPath(false, group, resource);
            }
            return require(path).api;
        }
    },
    requestAPI: function (req, res, next) {
        /**
         * request api
         * {
         *  method: 'get',
         *  resource: '/etc/samples',
         *  data: {
         *      id: 2
         *  },
         *  params: {
         *      id: 1
         *  }
         * }
         */
        var self = this;
        return function (options, callback) {
            var apiResource = options.resource;
            var method = options.method && options.method.toLowerCase();
            var params = options.params;
            var requestData = options.data;
            var api = self.getAPI(apiResource);
            if (api) {
                if (api[method]) {
                    var tempCallback = req.callback;
                    var query = req.query;
                    var body = req.body;
                    var tempParams = req.params;

                    req.query = {};
                    req.body = {};

                    if (method.toLowerCase() == 'get' || method.toLowerCase() == 'gets') {
                        req.query = requestData;
                    } else {
                        req.body = requestData;
                    }
                    req.params = params;

                    req.callback = function (status, data) {
                        req.callback = tempCallback;
                        req.query = query;
                        req.body = body;
                        req.params = tempParams;
                        callback(status, data);
                    };
                    api[method]()(req, res, next);
                } else {
                    callback(404);
                }
            } else {
                callback(404);
            }
        };
    },
    getCountryEnum: function (req) {

        if (req.body.country) req.body.country = req.body.country.toLowerCase();
        if (req.query.country) req.query.country = req.query.country.toLowerCase();

        var LOCAL = req.meta.local;
        var enumCountries = [];
        for (var k in LOCAL.countries) {
            enumCountries.push(k);
        }
        return enumCountries;
    },
    getLanguageEnum: function (req) {

        if (req.body.language) req.body.language = req.body.language.toLowerCase();
        if (req.query.language) req.query.language = req.query.language.toLowerCase();

        var LOCAL = req.meta.local;
        var enumLanguages = [];
        for (var k in LOCAL.languages) {
            enumLanguages.push(k);
        }
        return enumLanguages;
    },
    errorTranslator: function (err, lang) {
        var str = '';

        if (!lang) lang = 'ko';

        if (err instanceof Array) {
            for (var i = 0; i < err.length; ++i) {
                if (err[i].code) {
                    str += err[i].param + ": " + CODES[lang][err[i].code] + " ";
                }
            }
        } else {
            if (err.code) {
                str = CODES[lang][err.code];
            }
        }
        if (!str) str = err;
        return str;
    },
    attachZero: function (data) {
        if (typeof data == "number") {
            if (data < 10 && data >= 0) {
                return '0' + data;
            } else {
                return data;
            }
        } else {
            return null;
        }
    },
    sendToS3: function (file, folder, callback) {
        var config = require('../../../bridge/config/env');
        var AWS = require('aws-sdk');
        AWS.config.update({
            accessKeyId: config.aws.accessKeyId,
            secretAccessKey: config.aws.secretAccessKey,
            region: config.aws.region
        });
        var s3 = new AWS.S3();
        var bucket = config.aws.bucketName;

        fs.readFile(file.path, function (err, fileData) {

            if (err) {
                logger.e(err);
                return callback(500, {code: '500_4'});
            }
            var bn = path.basename(file.path);
            var params = {
                Bucket: bucket,
                Key: folder + '/' + bn,
                Body: fileData,
                ContentType: file.type
            };

            s3.putObject(params, function (err, data) {

                if (err) {
                    logger.e(err);
                    return callback(500, {code: '500_5'});
                } else {
                    fs.unlink(file.path, function (err) {
                        if (err) {
                            console.log("delete local file fail: ", err);
                        }
                    });
                }
                callback(200, data);

            });
        });
    },
    removeLocalFiles: function (files, callback) {
        if (files && files.length) {
            var funcs = [];
            for (var i=0; i<files.length; i++) {
                (function (file) {
                    funcs.push(function (n) {
                        fs.unlink(file.path, function (err) {
                            if (err) {
                                n(err, null);
                            } else {
                                n(null, true);
                            }
                        });
                    });
                })(files[i]);
            }
            async.parallel(funcs, function (err, results) {
                if (err) {
                    callback(400, {code: err});
                } else {
                    callback(204);
                }
            });
        } else {
            callback(204);
        }
    },
    moveFileDir: function (originPath, filePath, callback) {
        fs.rename(originPath, filePath, function (err) {
            if (err) {
                callback(400, {code: err});
            } else {
                callback(204);
            }
        });
    }
};