var appRootUrl = 'http://localhost:3001';
var appRootPath = require("app-root-path");

module.exports = {
    app: {
        secret: '123',
        maxUploadFileSize: 10 * 1024 * 1024,
        maxUploadFileSizeMBVersion: '10mb',
        port: 3001,
        rootUrl: appRootUrl,
        csFileDir: appRootPath.path + "/cs",
        uploadStore: "local",
        generateKey: "AWJDOF12389AAJWOD123xbk"
    },
    db: {
        mongodb: 'mongodb://localhost/slogup',
        redis: 'redis://localhost:6379/slogup',
        mysql: 'mysql://localhost:3306/core',
        logging: false,
        force: false,
        charset: "utf8",
        collate: "utf8_general_ci"
    },
    "flag": {
        "isUseHttps": false,
        "isUseRedis": false,
        "isUseCluster": false,
        "isDuplicatedLogin": true,
        "isAutoVerifiedEmail": true,
        "isUseChat": false,
        "isUseBrowserCount": true,
        "isMaintenance": false,
        "isAutoVerifiedAuthPhone": true,
        "checkMobileVersion": true
    },
    facebook: {
        clientID: '',
        clientSecret: '',
        callbackURL: appRootUrl + '/oauth/facebook/callback'
    },
    twitter: {
        clientID: '',
        clientSecret: '',
        callbackURL: appRootUrl + '/oauth/twitter/callback'
    },
    google: {
        clientID: '',
        clientSecret: '',
        callbackURL: appRootUrl + '/oauth/google/callback'
    },
    aws: {
        "accessKeyId": "",
        "secretAccessKey": "",
        "region": "",
        "bucketName": ""
    },
    sender: {
        apiStoreSMS: {
            senderName: "slogup",
            token: "MjIwOS0xNDIyMzQ2NDIxMzEwLWFjYWVmOTk0LTIzYTEtNGVmMi1hZWY5LTk0MjNhMTJlZjJkMQ==",
            from: "01076380387",
            url: 'http://api.openapi.io/ppurio/1/message/sms/slogup'
        },
        twillio: {
            "accountSID": "",
            "token": "",
            "from": ""
        },
        apn: {
            key: '',
            cert: '',
            gateway: "gateway.sandbox.push.apple.com",
            pass: "",
            port: 2195,
            cacheLength: 20
        },
        email: {
            host: 'smtp.gmail.com',
            port: 465,
            from: "ssgssk.cs@gmail.com",
            user: "ssgssk.cs@gmail.com",
            pass: "500exit12!@",
            name: "ssgssk.cs"
        },
        fcm: {
            key: 'AAAAdDBvseo:APA91bEqchc3OsC23zszObrhZ8EPoVo2qPFpKrT9A-aUNZKclq1mm5UlHmSZIPLBHtyJ3iPhnYfwIPleSJwVup_hmWSYNLEihc3BPeQsj9lgo_S9Hzau7Eh5bmRpumx4wzuHHYZzKgGl'
        }
    }
};