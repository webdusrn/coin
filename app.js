"use strict";
process.on('uncaughtException', function (err) {
    console.error((new Date()).toISOString(), 'uncaughtException');
    console.error(err.stack);
});

var fs = require('fs');
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
require('debug-fd-deprecated');

var config = require('./bridge/config/env');
var express = require('./bridge/config/express');
var initializeDatabase = require('./bridge/config/initialize-database');
var https = require('./core/server/config/https');
var socketIo = require('./core/server/config/socket-io');
var cluster = require('./core/server/config/cluster');
var log = require('./core/server/config/log');
var passport = require('./core/server/config/passport');
var sequelize = require('./core/server/config/sequelize');
var models = require('./bridge/models/sequelize');
var STD = require('./bridge/metadata/standards');

if (!process.env.AWS_ACCESS_KEY_ID) {
    process.env.AWS_ACCESS_KEY_ID = config.aws.accessKeyId;
}
if (!process.env.AWS_SECRET_ACCESS_KEY) {
    process.env.AWS_SECRET_ACCESS_KEY = config.aws.secretAccessKey;
}

var app = express(sequelize);
var server = https(app);
server = socketIo(server, app);

log();
passport();

console.log('database info : ', config.db);
sequelize.sync({force: config.db.force}).then(function (err) {
    initializeDatabase(function () {
        listenServer(server);
    });
}, function (err) {
    console.log('Unable to connect to the database:', err);
});

function listenServer (server) {
    if (!server.http && !server.https) {
        console.log("server setting error");
    } else {
        if (env == 'production' && config.flag.isUseCluster) {
            cluster.startCluster(server);
        } else {
            if (server.http) {
                server.http.listen(config.app.port);
                console.log('Server running at ' + config.app.port + ' ' + env + ' mode. logging: ' + config.db.logging);
            }
            if (server.https) {
                server.https.listen(config.app.httpsPort);
                console.log('Server running at ' + config.app.httpsPort + ' ' + env + ' mode. logging: ' + config.db.logging);
            }
        }
    }
}

module.exports = app;