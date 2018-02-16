var CONFIG = require('../../../bridge/config/env');
var META = require('../../../bridge/metadata');
var LOG = META.std.log;
var APP = CONFIG.app;

var path = require('path');
var fs = require('fs');
var appRoot = require('app-root-path');

var cron = require('node-cron');
var AWS = require('aws-sdk');
AWS.config.update({
    accessKeyId: CONFIG.aws.accessKeyId,
    secretAccessKey: CONFIG.aws.secretAccessKey,
    region: CONFIG.aws.region
});

var s3 = new AWS.S3();

var Logger = require('sg-logger');
var logger = new Logger(__filename);

function sendToS3(file, bucket, folder, callback) {
    fs.readFile(file.path, function (err, fileData) {

        if (err) {
            return callback({code: '500_4'});
        }

        var bn = path.basename(file.path);
        var params = {
            Bucket: bucket,
            Key: folder + '/' + bn,
            Body: fileData,
            ContentType: 'text'
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

module.exports = function () {
    if (APP.uploadStore == APP.uploadStoreS3) {
        cron.schedule('* * 1 * *', function () {

            var logRotateLogPath = appRoot + '/../.pm2/logs';
            var logPath = appRoot + '/' + LOG.folderName;


            if (fs.existsSync(logRotateLogPath) && fs.existsSync(logPath)) {

                var logRotateLogs = fs.readdirSync(logRotateLogPath);
                var logs = fs.readdirSync(logPath);


                logs.forEach(function (log) {

                    if (path.extname(log) === ".gz") {

                        var file = {
                            path: logPath + '/' + log
                        };

                        sendToS3(file, CONFIG.aws.bucketName, LOG.folderName, function (error, data) {
                            if (error) {
                                logger.e(error.code);
                                console.log('error', error.code);
                            } else {
                                fs.unlinkSync(file.path);
                                console.log('deleted', file.path);
                            }
                        });
                    }
                });

                logRotateLogs.forEach(function (logRotateLog) {
                    if (path.extname(logRotateLog) === ".gz") {
                        fs.unlinkSync(logRotateLogPath + '/' + logRotateLog);
                    }
                });

            }

        });
    }
};