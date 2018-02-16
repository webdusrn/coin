var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var fs = require('fs');
var path = require('path');
var async = require('async');
var json2csv = require('json2csv');
var events = require('events');
var Converter = require('csvtojson').Converter;
var iconv = require('iconv-lite');
var Iconv = require('iconv').Iconv;
var euckr2utf8 = new Iconv('EUC-KR', 'UTF-8');
var utf82utf8 = new Iconv('UTF-8', 'UTF-8');
var formData = require('form-data');
var key;
var parseKey;
var parseKeySecond;

post.validate = function () {
    return function (req, res, next) {
        var NOTIFICATION = req.meta.std.notification;

        // if (!req.body.folder || req.body.folder != req.meta.std.file.folderMessage) {
        //     return res.hjson(req, next, 400, {
        //         code: "400_3"
        //     });
        // }

        req.check("sendType", "400_3").isEnum(NOTIFICATION.enumSendTypes);

        if (req.body.sendType !== NOTIFICATION.sendTypeMessage) {
            req.check("sendMethod", "400_3").isEnum(NOTIFICATION.enumSendMethods);
        }

        req.check("notificationName", "400_8").len(NOTIFICATION.minTitleLength, NOTIFICATION.maxTitleLength);
        if (req.body.messageTitle !== undefined) req.check("messageTitle", "400_8").len(NOTIFICATION.minMessageTitleLength, NOTIFICATION.maxMessageTitleLength);

        if (req.body.sendType == NOTIFICATION.sendTypePush) {
            req.check("messageBody", "400_51").len(NOTIFICATION.minBodyLength, NOTIFICATION.maxBodyLength);
        } else {
            req.check("messageBody", "400_51").len(NOTIFICATION.minPushBodyLength, NOTIFICATION.maxPushBodyLength);
        }

        req.utils.common.checkError(req, res, next);
    };
};

post.checkNCreatePart = function () {
    return function (req, res, next) {

        var massNotification = {
            authorId: req.user.id,
            sendType: req.body.sendTypes,
            sendMethod: req.body.sendMethod,
            notificationName: req.body.notificationName,
            messageTitle: req.body.messageTitle,
            messageBody: req.body.messageBody,
            massNotificationImportHistory: {
                fileName: req.fileNames[0]
            }
        };
        req.models.MassNotification.createMassNotification(massNotification, function (status, data) {
            if (status == 201) {
                data.reload().then(function (data) {
                    req.massNotification = data;
                    next();
                });
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

post.series = function () {
    return function (req, res, next) {
        var APP = req.config.app;
        var NOTIFICATION = req.meta.std.notification;

        key = req.body.sendType;
        switch (key) {
            case NOTIFICATION.sendTypeMessage:
                parseKey = 'phoneNum';
                break;
            case NOTIFICATION.sendTypeEmail:
                parseKey = 'email';
                break;
            case NOTIFICATION.sendTypePush:
                parseKey = 'token';
                parseKeySecond = 'platform';
                break;
        }

        req.wrongDestinationCount = 0;

        var funcs = [];

        funcs.push(function (callback) {
            post.seriesSplitFile(req, callback);
        });

        if (APP.uploadStore == APP.uploadStoreS3) {
            funcs.push(function (callback) {
                post.seriesSendImportFile(req, callback);
            });
        } else if (APP.uploadStore == APP.uploadStoreLocal) {
            funcs.push(function (callback) {
                post.seriesMoveImportFile(req, callback);
            });
        } else if (APP.uploadStore == APP.uploadStoreLocalBucket) {
            /**
             *
             */
        }

        funcs.push(function (callback) {
            post.seriesReadSplitFileCreateMassNotification(req, callback);
        });

        funcs.push(function (callback) {
            post.seriesRemoveSplitFiles(req, callback);
        });

        funcs.push(function (callback) {
            post.seriesCountMassNotification(req, callback);
        });

        funcs.push(function (callback) {
            post.seriesFindMassNotificationPhoneNumNSendMessage(req, callback);
        });

        if (APP.uploadStore == APP.uploadStoreS3) {
            funcs.push(function (callback) {
                post.seriesSendMessageFile(req, callback);
            });
        } else if (APP.uploadStore == APP.uploadStoreLocalBucket) {
            /**
             *
             */
        }

        next();

        async.series(funcs, function (errorCode, results) {
            var update = {};
            if (errorCode) {
                update = {
                    errorCode: errorCode
                };
                if (errorCode != "400_66" && errorCode != "400_67" && errorCode != "404_13") {
                    post.seriesRemoveSplitFiles(req, function (err) {
                        if (err) {
                            console.log("remove split files fail");
                        }
                    });
                }
            } else {
                update = {
                    wrongDestinationCount: req.wrongDestinationCount,
                    progress: 100
                };
            }
            req.models.MassNotification.updateDataById(req.massNotification.id, update, function (status, data) {
                if (status == 204) {
                    if (errorCode) {
                        console.log("csv export file error:", errorCode);
                    } else {
                        console.log("csv export progress:", update.progress);
                    }
                } else {
                    console.log("update exportHistory fail", new Date());
                }
            });
        });
    };
};

post.seriesSplitFile = function (req, callback) {
    var NOTIFICATION = req.meta.std.notification;

    req.splitTimes = 0;

    var APP = req.config.app;
    var LOCAL = req.meta.std.local;
    var MASS_NOTIFICATION_IMPORT_HISTORY = req.meta.std.massNotificationImportHistory;
    var converter = new Converter({});
    var FILE = req.meta.std.file;
    var COMMON_UTIL = req.coreUtils.common;
    var NOTIFICATION_UTIL = req.coreUtils.notification;
    var maxSize = MASS_NOTIFICATION_IMPORT_HISTORY.maxRawSize;
    var importedFile = '';
    var eventEmitter = new events.EventEmitter();
    eventEmitter.setMaxListeners(eventEmitter.getMaxListeners() + 1);

    if (APP.uploadStore == APP.uploadStoreS3) {
        importedFile = path.join(__dirname, "../../../../../" + LOCAL.tempUrl + '/' + req.massNotification.massNotificationImportHistory.fileName);
    } else if (APP.uploadStore == APP.uploadStoreLocal) {
        importedFile = path.join(__dirname, "../../../../../" + LOCAL.uploadUrl + '/' + req.massNotification.massNotificationImportHistory.fileName);
    } else if (APP.uploadStore == APP.uploadStoreLocalBucket) {
        /**
         *
         */
    }
    var splitFile = LOCAL.uploadUrl + '/' + FILE.folderEtc + '/' + FILE.folderNotification + '/';

    var inputError = false;
    var checkFinish = false;
    var checkIndex = {};

    var dataArray = [];

    fs.createReadStream(importedFile)
        .pipe(euckr2utf8)
        .on('error', function () {
            fs.createReadStream(importedFile)
                .pipe(utf82utf8)
                .on('error', function () {
                    if (!inputError) {
                        inputError = true;
                        COMMON_UTIL.removeLocalFiles(req.files, function (status, data) {
                            if (status == 400) {
                                console.log("remove local file fail:", data.code);
                            }
                            callback("400_66", false);
                        });
                    }
                })
                .pipe(converter)
                .on('error', function () {
                    if (!inputError) {
                        inputError = true;
                        COMMON_UTIL.removeLocalFiles(req.files, function (status, data) {
                            if (status == 400) {
                                console.log("remove local file fail:", data.code);
                            }
                            callback("400_67", false);
                        });
                    }
                });
        })
        .pipe(converter)
        .on('error', function () {
            if (!inputError) {
                inputError = true;
                COMMON_UTIL.removeLocalFiles(req.files, function (status, data) {
                    if (status == 400) {
                        console.log("remove local file fail:", data.code);
                    }
                    callback("400_67", false);
                });
            }
        });

    converter.on("record_parsed", function (resultRow) {

        if (key == NOTIFICATION.sendTypePush) {

            if (resultRow[parseKey] && resultRow[parseKey]) {

                var row = {
                    key: NOTIFICATION_UTIL.massNotification.parse[key](resultRow[parseKey]),
                    platform: NOTIFICATION_UTIL.massNotification.parse[key](resultRow[parseKeySecond])
                };

                dataArray.push(row);
            } else {
                if (!inputError) {
                    inputError = true;
                    eventEmitter.emit('inputError', '400_53')
                }
            }
        } else {
            if (resultRow[parseKey]) {
                dataArray.push({
                    key: NOTIFICATION_UTIL.massNotification.parse[key](resultRow[parseKey])
                });
            } else {
                if (!inputError) {
                    inputError = true;
                    eventEmitter.emit('inputError', '400_53')
                }
            }
        }

        if (dataArray.length == maxSize) {
            var array = dataArray.slice();
            dataArray = [];
            req.splitTimes++;

            (function (currentTime) {
                var splitFilePath = splitFile + currentTime + req.massNotification.massNotificationImportHistory.fileName;
                NOTIFICATION_UTIL.massNotification.import.writeSplitFile(array, currentTime, [key], splitFilePath, function () {
                    eventEmitter.emit('checkFinish', currentTime);
                }, function (errorCode) {
                    if (!inputError) {
                        inputError = true;
                        eventEmitter.emit('inputError', errorCode);
                    }
                });
            })(req.splitTimes - 1);
        }
    });

    converter.on('end_parsed', function () {
        checkFinish = true;
        if (dataArray.length > 0) {
            req.splitTimes++;
            (function (currentTime) {
                var splitFilePath = splitFile + currentTime + req.massNotification.massNotificationImportHistory.fileName;
                NOTIFICATION_UTIL.massNotification.import.writeSplitFile(dataArray, currentTime, [key], splitFilePath, function () {
                    eventEmitter.emit('checkFinish', currentTime);
                }, function (errorCode) {
                    if (!inputError) {
                        inputError = true;
                        eventEmitter.emit('inputError', errorCode);
                    }
                });
            })(req.splitTimes - 1);
        }
        eventEmitter.emit('checkFinish');
    });

    eventEmitter.on('inputError', function (errorCode) {
        callback(errorCode, false);
    });

    eventEmitter.on('checkFinish', function (currentIndex) {
        if (currentIndex !== undefined) checkIndex[currentIndex] = true;
        if (checkFinish) {
            var isFinish = true;
            for (var i = 0; i < req.splitTimes; i++) {
                if (!checkIndex[i]) {
                    isFinish = false;
                    break;
                }
            }
            if (isFinish) {
                if (!inputError) {
                    callback(null, true);
                }
            }
        }
    });
};

post.seriesSendImportFile = function (req, callback) {
    var FILE = req.meta.std.file;
    var LOCAL = req.meta.std.local;
    var importFilePath = path.join(__dirname, "../../../../../" + LOCAL.tempUrl + '/' + req.massNotification.massNotificationImportHistory.fileName);
    var file = {
        path: importFilePath,
        type: 'text/csv'
    };
    var folder = FILE.folderEtc + '/' + FILE.folderNotification;
    req.coreUtils.common.sendToS3(file, folder, function (status, data) {
        if (status == 200) {
            callback(null, true);
        } else {
            callback(data.code, false);
        }
    });
};

post.seriesMoveImportFile = function (req, callback) {
    var FILE = req.meta.std.file;
    var LOCAL = req.meta.std.local;
    var importFilePath = path.join(__dirname, "../../../../../" + LOCAL.uploadUrl + '/' + req.massNotification.massNotificationImportHistory.fileName);
    var filePath = importFilePath.replace(LOCAL.uploadUrl, LOCAL.uploadUrl + '/' + FILE.folderEtc + '/' + FILE.folderNotification);
    req.coreUtils.common.moveFileDir(importFilePath, filePath, function (status, data) {
        if (status == 204) {
            callback(null, true);
        } else {
            callback(data.code, false);
        }
    });
};

post.seriesReadSplitFileCreateMassNotification = function (req, callback) {

    var LOCAL = req.meta.std.local;
    var FILE = req.meta.std.file;
    var NOTIFICATION = req.meta.std.notification;
    var funcs = [];

    for (var i = 0; i < req.splitTimes; i++) {
        (function (currentTime) {
            var dataArray = [];
            funcs.push(function (subCallback) {
                var converter = new Converter({});
                var splitFilePath = path.join(__dirname, "../../../../../" + LOCAL.uploadUrl + '/' + FILE.folderEtc + '/' + FILE.folderNotification + '/' + currentTime + req.massNotification.massNotificationImportHistory.fileName);
                fs.createReadStream(splitFilePath)
                    .pipe(iconv.decodeStream('utf8'))
                    .pipe(iconv.encodeStream('utf8'))
                    .pipe(converter);
                converter.on("record_parsed", function (resultRow) {
                    if (resultRow.key == NOTIFICATION.wrongPhoneNum) {
                        req.wrongDestinationCount++;
                    } else {
                        dataArray.push({dest: resultRow.key, platform: resultRow.platform});
                    }
                });
                converter.on("end_parsed", function () {
                    req.models.MassNotificationDest.createMassNotificationDest(dataArray, function (status, data) {
                        if (status == 204) {
                            var progress = Math.floor(currentTime * 50 / req.splitTimes);
                            req.models.MassNotification.updateDataById(req.massNotification.id, {
                                progress: progress
                            }, function (status) {
                                if (status == 204) {
                                    console.log("csv export progress:", progress);
                                }
                                subCallback(null, true);
                            });
                        } else {
                            subCallback(data.code, false);
                        }
                    });
                });
            });
        })(i);
    }

    async.series(funcs, function (errorCode, results) {
        if (errorCode) {
            callback(errorCode, false);
        } else {
            callback(null, true);
        }
    });
};

post.seriesRemoveSplitFiles = function (req, callback) {
    var COMMON_UTIL = req.coreUtils.common;
    var LOCAL = req.meta.std.local;
    var FILE = req.meta.std.file;
    var files = [];
    var splitPath = path.join(__dirname, "../../../../../" + LOCAL.uploadUrl + '/' + FILE.folderEtc + '/' + FILE.folderNotification + '/');
    for (var i = 0; i < req.splitTimes; i++) {
        files.push({
            path: splitPath + i + req.massNotification.massNotificationImportHistory.fileName
        });
    }
    COMMON_UTIL.removeLocalFiles(files, function (status, data) {
        if (status == 400) {
            console.log("remove split file fail:", data.code);
        }
        callback(null, true);
    });
};

post.seriesCountMassNotification = function (req, callback) {
    var maxSize = req.meta.std.massNotificationImportHistory.maxRawSize;
    req.models.MassNotificationDest.countMassNotificationDest(function (status, data) {
        if (status == 200) {
            var totalCount = data;
            req.splitTimes = Math.floor(totalCount / maxSize);
            if (totalCount % maxSize) {
                req.splitTimes++;
            }

            var update = {
                totalCount: totalCount
            };

            req.models.MassNotification.updateDataById(req.massNotification.id, update, function (status, data) {
                if (status == 204) {
                    callback(null, true);
                } else {
                    console.log("update massNotification totalCount -> fail", new Date());
                }
            });

        } else {
            callback(data.code, false);
        }
    });
};

post.seriesFindMassNotificationPhoneNumNSendMessage = function (req, callback) {
    var NOTIFICATION_UTIL = req.coreUtils.notification;
    var MASS_NOTIFICATION_IMPORT_HISTORY = req.meta.std.massNotificationImportHistory;
    var NOTIFICATION = req.meta.std.notification;
    var funcs = [];
    var file = null;

    if (req.body.sendMethod == NOTIFICATION.sendMethodMms && req.fileNames.length > 1) {
        file = req.files[1];
    }

    var options = {
        size: MASS_NOTIFICATION_IMPORT_HISTORY.maxRawSize
    };

    for (var i = 0; i < req.splitTimes; i++) {
        (function (currentTime) {
            funcs.push(function (subCallback) {

                req.models.MassNotificationDest.findMassNotificationDest(options, function (status, data) {
                    if (status == 200) {
                        var sendTargetArray = [];
                        for (var i = 0; i < data.length; i++) {
                            sendTargetArray.push({
                                sendType: key,
                                dest: data[i].dest,
                                title: req.body.messageTitle,
                                message: req.body.messageBody,
                                platform: data[i].platform
                            });
                        }
                        options.last = data[data.length - 1].id;
                        NOTIFICATION_UTIL.massNotification.sendAll(req, sendTargetArray, file, function (failArray) {
                            if (failArray) {
                                /**
                                 * fail array method
                                 */
                            }
                            var progress = 50 + Math.floor(currentTime * 50 / req.splitTimes);
                            req.models.MassNotification.updateDataById(req.massNotification.id, {
                                sendCount: sendTargetArray.length - failArray.length,
                                progress: progress
                            }, function (status, data) {
                                if (status == 204) {
                                    console.log("csv export progress:", progress);
                                }
                                subCallback(null, true);
                            });
                        });

                    } else {
                        subCallback(null, true);
                    }
                });


            });
        })(i);
    }

    async.series(funcs, function (errorCode, results) {
        if (errorCode) {
            callback(errorCode, false);
        } else {
            callback(null, true);
        }
    });
};

post.seriesSendMessageFile = function (req, callback) {
    var LOCAL = req.meta.std.local;
    var FILE = req.meta.std.file;
    var messageFilePath = path.join(__dirname, "../../../../../" + LOCAL.uploadUrl + '/' + FILE.folderEtc + '/' + FILE.folderMessage + '/' + req.massNotification.id + '.csv');
    var file = {
        path: messageFilePath,
        type: 'text/csv'
    };
    var folder = file.folderEtc + '/' + FILE.folderMessage;
    req.coreUtils.common.sendToS3(file, folder, function (status, data) {
        if (status == 200) {
            callback(null, true);
        } else {
            callback(data.code, false);
        }
    });
};

post.supplement = function () {
    return function (req, res, next) {
        res.set('cache-control', 'no-cache, no-store, must-revalidate');
        res.set('pragma', 'no-cache');
        res.set('expires', 0);
        return res.hjson(req, next, 200, req.massNotification);
    };
};

module.exports = post;
