"use strict";

var config = require('../../../bridge/config/env');
var dbUrl = require('../../../bridge/config/env').db.mysql;
var url = require('url');

dbUrl = url.parse(dbUrl);
dbUrl.protocol = dbUrl.protocol.replace(":", "");
dbUrl.db = dbUrl.path.replace("/", "");
dbUrl.auth = dbUrl.auth && dbUrl.auth.split(":") || null;
if (dbUrl.auth && dbUrl.auth.length == 2) {
    dbUrl.username = dbUrl.auth[0];
    dbUrl.password = dbUrl.auth[1];
}


var Sequelize = require('sequelize');
require('sequelize-definer')(Sequelize);

var connectObject = {
    host: dbUrl.hostname,
    dialect: dbUrl.protocol,
    port: dbUrl.port,
    define: {
        underscored: false,
        freezeTableName: false,
        syncOnAssociation: true,
        timestamps: true
    },
    dialectOptions: {
        charset: config.db.charset,
        collate: config.db.collate
    }
};

if (dbUrl.hostname == 'localhost') {
    connectObject.dialectOptions.socketPath = '/tmp/mysql.sock';
    connectObject.dialectOptions.supportBigNumbers = true;
    connectObject.dialectOptions.bigNumberStrings = true;
}

if (config.db.logging) {
    connectObject.logging = console.log;
} else {
    connectObject.logging = false
}

var sequelize = new Sequelize(dbUrl.db, dbUrl.username, dbUrl.password, connectObject);

module.exports = sequelize;