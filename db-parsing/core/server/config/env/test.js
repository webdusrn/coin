module.exports = {
    app: {
        secret: 'test',
        port: 9001
    },
    db: {
        redis: 'redis://localhost:6379/slogup2',
        socketRedis: "",
        mysql: 'mysql://slogup:123123@localhost:3306/test',
        logging: false,
        force: false
    }
};