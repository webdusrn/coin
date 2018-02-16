var coreInitializeDatabase = require('../../core/server/config/initialize-database');
var fs = require('fs');
var path = require('path');
var appInitializeDatabase = null;

if (fs.existsSync(path.resolve(__dirname, '../../app/server/config/initialize-database.js'))) {
    appInitializeDatabase = require('../../app/server/config/initialize-database');
}

module.exports = function (callback) {
    coreInitializeDatabase(function () {
        if (appInitializeDatabase) {
            appInitializeDatabase(callback);
        } else {
            callback();
        }
    });
};