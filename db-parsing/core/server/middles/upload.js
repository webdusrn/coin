var path = require('path');
var fs = require('fs');
var async = require('async');
var gm = require('gm').subClass({imageMagick: true});
var STD = require('../../../bridge/metadata/standards');
var appRootPath = require("app-root-path").path;
var rootDirName = appRootPath.split('/');
rootDirName = rootDirName[rootDirName.length - 1];

var Logger = require('sg-logger');
var logger = new Logger(__filename);
var maxLength = 1000;

module.exports = function (config) {
    var AWS = require('aws-sdk');
    AWS.config.update({
        accessKeyId: config.aws.accessKeyId,
        secretAccessKey: config.aws.secretAccessKey,
        region: config.aws.region
    });

    var s3 = new AWS.S3();
    var APP = config.app;

    function Upload() {
    }

    function removeS3Files (req, res, next) {
        if (req.files) {
            var bucket = config.aws.bucketName;
            var files = req.files;

            var funcs = [];

            var splitLength = Math.floor(files.length / maxLength);
            var restLength = 0;
            if (files.length % maxLength) {
                restLength = files.length % maxLength;
                splitLength++;
            }

            for (var i = 0; i < splitLength; ++i) {
                (function (currentTime) {

                    funcs.push(function (callback) {
                        var deleteObject = {
                            Objects: []
                        };

                        var length = 0;
                        if (currentTime == splitLength - 1) {
                            length = restLength;
                        } else {
                            length = maxLength;
                        }

                        for (var j=0; j < length; ++j) {
                            var path = files[currentTime * maxLength + j].path;
                            deleteObject.Objects.push({
                                Key: path
                            });
                        }

                        s3.deleteObjects({
                            Bucket: bucket,
                            Delete: deleteObject
                        }, function (err, data) {
                            if (err) {
                                logger.e(err);
                            }
                            callback(null, true);
                        });

                    });

                })(i);
            }

            async.series(funcs, function (err, results) {

            });
        }

        next();
    }

    function sendToS3(file, bucket, folder, callback) {
        fs.readFile(file.path, function (err, fileData) {

            if (err) {
                logger.e(err);
                return callback({code: '500_4'});
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
                    return callback({code: '500_5'});
                }

                callback(null, data);
            });
        });
    }

    function sendFilesToS3 (req, res, next) {
        if (req.files) {
            var folder = req.folder;
            var funcs = [];

            req.files.forEach(function (file) {
                (function (f) {
                    funcs.push(function (n) {
                        sendToS3(f, config.aws.bucketName, folder, function (err, data) {
                            if (err) n(err);
                            else n(null, data);
                        });
                    });
                })(file);
            });

            async.parallel(funcs, function (err, results) {
                if (err) {
                    logger.e(err);
                    return res.hjson(req, next, 500, {
                        code: err.code
                    });
                }
                removeFiles(req, res, next);
            });
        } else {
            next();
        }
    }

    function removeFiles (req, res, next) {
        if (APP.uploadStore == APP.uploadStoreLocal) {
            var localPath = appRootPath + '/' + STD.local.uploadUrl + '/';
            for (var i = 0; i < req.files.length; i++) {
                if (req.files[i].path) {
                    req.files[i].path = localPath + req.files[i].path;
                }
            }
        }
        req.removeLocalFiles(function (err) {
            next();
        });
    }

    function removeLocalBucketFiles (req, res, next) {
        var localPath = path.join(appRootPath, '../static/');
        for (var i=0; i<req.files.length; i++) {
            if (req.files[i].path) {
                req.files[i].path = localPath + req.files[i].path;
            }
        }
        req.removeLocalFiles(function (err) {
            next();
        });
    }

    function moveFiles (req, res, next) {
        if (req.files && req.folder) {
            var stat;
            var filePath;

            filePath = appRootPath + '/' + STD.local.uploadUrl + '/' + req.folder;
            stat = fs.existsSync(filePath);
            if (!stat) {
                fs.mkdirSync(filePath);
            }

            var files = req.files;
            var funcs = [];

            for (var i = 0; i < files.length; ++i) {
                var file = files[i];
                (function (file) {
                    funcs.push(function (n) {
                        var originPath = file.path;
                        file.path = file.path.replace(STD.local.uploadUrl + '/', STD.local.uploadUrl + '/' + req.folder + '/');
                        fs.rename(originPath, file.path, function (err) {
                            if (err) {
                                n(err, null);
                            } else {
                                n(null, true);
                            }
                        });
                    });
                })(file);
            }

            async.parallel(funcs, function (err, results) {
                if (err) {
                    console.error(err);
                    return res.hjson(req, next, 500);
                }
                return next();
            });
        } else {
            next();
        }
    }

    function moveLocalBucketFiles (req, res, next) {
        if (req.files && req.folder) {
            var stat;
            var filePath;

            filePath = path.join(appRootPath, '../static/' + req.folder);
            stat = fs.existsSync(filePath);
            if (!stat) {
                fs.mkdirSync(filePath);
            }

            var files = req.files;
            var funcs = [];

            for (var i = 0; i < files.length; ++i) {
                var file = files[i];
                (function (file) {
                    funcs.push(function (n) {
                        var originPath = file.path;
                        file.path = file.path.replace('static/', 'static/' + req.folder + '/');
                        fs.rename(originPath, file.path, function (err) {
                            if (err) {
                                n(err, null);
                            } else {
                                n(null, true);
                            }
                        });
                    });
                })(file);
            }

            async.parallel(funcs, function (err, results) {
                if (err) {
                    console.error(err);
                    return res.hjson(req, next, 500);
                }
                return next();
            });
        } else {
            next();
        }
    }

    Upload.prototype.storeFiles = function () {
        return function (req, res, next) {
            var uploadStore = APP.uploadStore;
            if (uploadStore == APP.uploadStoreLocal) {
                moveFiles(req, res, next);
            } else if (uploadStore == APP.uploadStoreS3) {
                sendFilesToS3(req, res, next);
            } else if (uploadStore == APP.uploadStoreLocalBucket) {
                moveLocalBucketFiles(req, res, next);
            } else {
                next();
            }
        }
    };

    Upload.prototype.deleteFiles = function () {
        return function (req, res, next) {
            var uploadStore = APP.uploadStore;
            if (uploadStore == APP.uploadStoreLocal) {
                removeFiles(req, res, next);
            } else if (uploadStore == APP.uploadStoreS3) {
                removeS3Files(req, res, next);
            } else if (uploadStore == APP.uploadStoreLocalBucket) {
                removeLocalBucketFiles(req, res, next);
            } else {
                next();
            }
        };
    };

    Upload.prototype.checkFileBytes = function (minSize, maxSize) {
        return function (req, res, next) {

            var isExceed = true;

            req.files.forEach(function (file) {
                console.log(file);
                if (file.size < minSize || file.size > maxSize) {
                    isExceed = false;
                }
            });

            if (isExceed) {
                next();
            } else {
                return res.hjson(req, next, 400, {
                    code: '400_54'
                });
            }

        };
    };

    Upload.prototype.reorderByExtension = function (extension) {
        return function (req, res, next) {

            req.files.forEach(function (file, index) {

                var split = file.name.split('.');
                var fileExtension = split[split.length - 1];
                fileExtension.toLowerCase();
                extension.toLowerCase();

                if (fileExtension == extension) {
                    req.files.unshift(req.files.splice(index, 1)[0]);
                }

            });

            next();

        };
    };

    Upload.prototype.refineFiles = function () {
        return function (req, res, next) {
            req.refineFiles(function (err) {
                if (err) {
                    if (err.message == 'exceed') {
                        return res.hjson(req, next, 400, {
                            code: '400_54'
                        });
                    } else {
                        return res.hjson(req, next, 400, {
                            code: '400_4'
                        });
                    }
                }
                req.fileNames = [];
                req.files.forEach(function (file) {
                    req.fileNames.push(path.basename(file.path));
                });

                if (req.removeLocalFiles) {
                    req.removeFiles = req.removeLocalFiles;
                }

                next();
            });
        };
    };

    Upload.prototype.checkFileCount = function (min, max) {

        return function (req, res, next) {
            if (req.files) {
                if (!max) max = 99999;
                var len = req.files.length;
                if (len < min || len > max) {

                    if (req.removeLocalFiles) {
                        req.removeLocalFiles(function (err) {
                        });
                    }

                    return res.hjson(req, next, 400, {code: '400_21'});
                }
            }
            next();
        };
    };

    Upload.prototype.checkFileFormat = function (types) {
        return function (req, res, next) {

            if (req.files) {
                var joinedTypes = types.join("|");
                var f = req.files;
                for (var i = 0; i < f.length; ++i) {
                    var name = f[i].name;
                    var regexp = new RegExp(".(" + joinedTypes + ")$", "i");

                    if (!name.match(regexp)) {
                        if (req.removeLocalFiles) {
                            req.removeLocalFiles(function (err) {
                            });
                        }
                        return res.hjson(req, next, 400, {code: '400_22'});
                    }
                }
            }
            next();
        };
    };

    Upload.prototype.checkInvalidFileType = function (types) {
        return function (req, res, next) {

            if (req.files) {
                var joinedTypes = types.join("|");
                var f = req.files;
                for (var i = 0; i < f.length; ++i) {
                    var name = f[i].name;
                    var regexp = new RegExp(".(" + joinedTypes + ")$", "i");

                    if (name.match(regexp)) {
                        if (req.removeLocalFiles) {
                            req.removeLocalFiles(function (err) {
                            });
                        }
                        return res.hjson(req, next, 400, {code: '400_22'});
                    }
                }
            }
            next();
        };
    };

    Upload.prototype.createPrefixName = function () {
        return function (req, res, next) {
            var date = new Date();
            var datePrefix = date.getYear().toString();
            datePrefix = datePrefix.substr(2, 2);
            datePrefix += date.getMonth();
            datePrefix += date.getDay();

            if (req.user) {
                req.prefix = req.user.id + "_" + datePrefix;
            }
            else {
                req.prefix = datePrefix;
            }
            next();
        };
    };

    Upload.prototype.createResizeOptions = function () {
        return function (req, res, next) {

            var FILE = req.meta.std.file;
            req.imageOptions = null;

            if (req.body.folder == FILE.folderUser) {
                req.imageOptions = FILE.userSize;
            }
            else if (req.body.folder == FILE.folderBg) {
                req.imageOptions = FILE.bgSize;
            }
            else {
                req.imageOptions = FILE.commonSize;
            }

            next();
        };
    };

    Upload.prototype.autoOrient = function () {
        return function (req, res, next) {
            if (req.files && req.files.length > 0) {
                var funcs = [];

                req.files.forEach(function (file) {
                    (function () {
                        funcs.push(function (n) {
                            var filePath = file.path;
                            gm(filePath).autoOrient().write(filePath, function (err, stdout, stderr, command) {
                                if (err) {
                                    console.error("autoOrient", err);
                                    return n(err, false);
                                }
                                n(null, true);
                            });
                        });
                    })(file);
                });

                async.parallel(funcs, function (err, results) {
                    if (err) {
                        logger.e(err);
                        return res.hjson(req, next, 400, {
                            code: '400_4'
                        });
                    } else {
                        next();
                    }

                });
            } else {
                next();
            }
        };
    };

    Upload.prototype.normalizeImages = function () {
        return function (req, res, next) {
            if (req.files && req.files.length > 0) {
                var FILE = req.meta.std.file;

                var funcs = [];

                req.files.forEach(function (file) {

                    funcs.push(function (n) {

                        var filePath = file.path;
                        var dir = path.dirname(filePath);
                        var bn = path.basename(filePath);

                        gm(filePath).size(function (err, value) {

                            if (err) {
                                console.error('size', err, value);
                                return n(err, null);
                            }

                            if (req.body.width === undefined) req.body.width = value.width;
                            if (req.body.height === undefined) req.body.height = value.height;
                            if (req.body.offsetX === undefined) req.body.offsetX = 0;
                            if (req.body.offsetY === undefined) req.body.offsetY = 0;

                            gm(filePath).crop(req.body.width, req.body.height, req.body.offsetX, req.body.offsetY).stream(function (err, stdout, stderr) {
                                if (err) {
                                    console.error('crop', err);
                                    return n(err, null);
                                }

                                var subFuncs = [];
                                for (var i = 0; i < req.imageOptions.length; ++i) {
                                    (function (i) {
                                        subFuncs.push(function (nn) {

                                            var option = req.imageOptions[i];
                                            if (option.w && option.w > value.width) {
                                                option.w = value.width;
                                            }

                                            if (option.h && option.h > value.height) {
                                                option.h = value.height;
                                            }

                                            // !는 강제로 비율을 맞추는 역할.
                                            var resizePath = dir + '/' + FILE.enumPrefixes[i] + bn;
                                            gm(stdout).quality(75).resize(option.w, option.h).write(resizePath, function (err, stdout, stderr, command) {
                                                if (err) return nn(err, null);
                                                req.files.push({
                                                    path: resizePath,
                                                    type: file.type
                                                });
                                                nn(null, null);
                                            });
                                        });
                                    })(i);
                                }

                                async.parallel(subFuncs, function (err, results) {
                                    if (err) {
                                        n(err, null);
                                    } else {
                                        n(null, null);
                                    }
                                });
                            });
                        });
                    });

                });

                async.parallel(funcs, function (err, results) {
                    if (err) {
                        logger.e(err);
                        return res.hjson(req, next, 400, {
                            code: '400_4'
                        })
                    } else {
                        next();
                    }
                });
            }
            else {
                next();
            }
        };
    };

    Upload.prototype.removeLocalFiles = function () {
        return function (req, res, next) {
            removeFiles(req, res, next);
        };
    };

    Upload.prototype.generateFolder = function (parentFolder) {
        return function (req, res, next) {
            var now = new Date();
            req.dateFolder = now.getUTCFullYear() + '-' + req.coreUtils.common.attachZero(now.getUTCMonth() + 1) + '-' + req.coreUtils.common.attachZero(now.getUTCDate());
            req.folder = parentFolder + '/' + req.body.folder + '/' + req.dateFolder;
            next();
        };
    };

    Upload.prototype.moveFileDir = function () {
        return function (req, res, next) {
            moveFiles(req, res, next);
        };
    };

    return new Upload();
};