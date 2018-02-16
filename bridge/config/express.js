var coreExpress = require('../../core/server/config/express').init;
var CONFIG = require('./env');
var fs = require('fs');
var path = require('path');
var appExpress = null;

if (fs.existsSync(path.resolve(__dirname, '../../app/server/config/express.js'))) {
    appExpress = require('../../app/server/config/express');
}

var isUseAppDir = false;
if (fs.existsSync(path.resolve(__dirname, '../../app'))) {
    isUseAppDir = true;
}

var sgcResponder = require('sg-responder');

module.exports = function(sequelize) {
    var app = coreExpress(sequelize);
    
    if (appExpress) appExpress(app);
    require('../../core/routes/')(app);
    if (isUseAppDir) require('../../app/routes')(app);

    app.use(sgcResponder.errorHandler());

    return app;
};