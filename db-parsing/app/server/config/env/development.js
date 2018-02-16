module.exports = {
    app: {
        port: 10004,
        uploadStore: "localBucket"
    },
    flag: {
        isUseRedis: false,
        checkMobileVersion: false
    },
    db: {
        mysql: 'mysql://slogup:123123@localhost:3306/coin',
        logging: false,
        force: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci"
    },
    sender: {
        apiStoreSMS: {
            senderName: "slogup",
            token: "MjIwOS0xNDIyMzQ2NDIxMzEwLWFjYWVmOTk0LTIzYTEtNGVmMi1hZWY5LTk0MjNhMTJlZjJkMQ==",
            from: "01076380387",
            url: 'http://api.openapi.io/ppurio/1/message/sms/slogup'
        }
    }
};