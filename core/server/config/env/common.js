module.exports = {
    "app": {
        "secret": "secre2tsecr2et123",
        "maxUploadFileSize": 100 * 1024 * 1024,
        "maxUploadFileSizeMBVersion": "100mb",
        "port": 3001,
        "apiName": "api",
        "isServerChecking": false,
        "deletedUserPrefix": "deletedUser0323",
        "sessionExpiredSeconds": 60 * 60 * 24 * 100,
        "uploadStore": "local",
        "enumUploadStores": ["local", "s3", "localBucket"],
        "uploadStoreLocal": "local",
        "uploadStoreS3": "s3",
        "uploadStoreLocalBucket": "localBucket",
        "maxClusterLength": 0
    },
    "db": {
        "off": false,
        "mongodb": "mongodb://localhost/slogup",
        "redis": "redis://localhost:6379/slogup",
        "socketRedis": "",
        "mysql": "mysql://slogup:123123@localhost:3306/core",
        "logging": false,
        "force": false,
        "charset": "utf8mb4",
        "collate": "utf8mb4_general_ci"
    },
    "flag": {
        "isUseHttps": false,
        "isUseRedis": false,
        "isUseCluster": false,
        "isDuplicatedLogin": false,
        "isAutoVerifiedEmail": false,
        "isUseChat": false,
        "isUseBrowserCount": false,
        "isMaintenance": false,
        "isAutoVerifiedAuthPhone": false,
        "isNotUseClusterRoundRobin": false
    },
    "facebook": {
        "clientID": "",
        "clientSecret": "",
        "callbackURL": "http://local.slogup.com:3001/oauth/facebook/callback"
    },
    "twitter": {
        "clientID": "",
        "clientSecret": "",
        "callbackURL": "http://local.slogup.com:3001/oauth/twitter/callback"
    },
    "google": {
        "clientID": "",
        "clientSecret": "",
        "callbackURL": "http://local.slogup.com:3000/oauth/google/callback"
    },
    "aws": {
        "accessKeyId": "",
        "secretAccessKey": "",
        "region": "",
        "bucketName": ""
    },
    "sender": {
        "infoBankSMS": {
            "senderName": "slogup",
            "serviceId": "",
            "servicePw": "",
            "from": "",
            "mmsSendUrl": "",
            "tokenUrl": "",
            "imageUploadUrl": "",
            "mmsUse": "false"
        },
        "apiStoreSMS": {
            "senderName": "slogup",
            "token": "",
            "from": "",
            "url": ""
        },
        "twillio": {
            "accountSID": "",
            "token": "",
            "from": ""
        },
        "apn": {
            "gateway": "gateway.sandbox.push.apple.com",
            "pass": "",
            "port": 2195,
            "cacheLength": 20
        },
        "gcm": {
            "key": "",
            "retry": 20
        },
        "fcm": {
            "key": ""
        },
        "email": {
            "host": "",
            "port": 587,
            "from": "",
            "user": "",
            "pass": "",
            "name": ""
        }
    },
    "authCi": {
        "allowedIp": ''
    },
    "popbill": {
        "serviceId": 'POPBILL_TEST',
        "linkId": '',
        "secretKey": '',
        "corpName": '',
        "isTest": true
    }
};