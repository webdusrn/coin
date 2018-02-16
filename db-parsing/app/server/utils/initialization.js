var STD = require('../../../bridge/metadata/standards');
var LOCAL = require('../../../bridge/metadata/localization');
var fs = require('fs');
var path = require('path');
var config = require('../../../bridge/config/env');
var sequelize = require('../../../core/server/config/sequelize');
var errorHandler = require('sg-sequelize-error-handler');
var MICRO = require('microtime-nodejs');

module.exports = {
    defaultAppMeta: {

    },
    run: function (callback) {
        callback(204);
    }
};