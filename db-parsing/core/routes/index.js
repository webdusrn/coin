var CONFIG = require('../../bridge/config/env');
var express = require('express');
module.exports = function (app) {
    require('./api')(app, CONFIG.app.apiName);
    require('./maintenance')(app);
    require('./sample')(app);
};