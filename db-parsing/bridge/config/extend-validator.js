
var fs = require('fs');
var path = require('path');
var utils = require('../utils');

var coreValidator = require('../../core/server/config/extend-validator');
var appValidator = null;

if (fs.existsSync(path.resolve(__dirname, '../../app/server/config/extend-validator.js'))) {
    appValidator = require('../../app/server/config/extend-validator');
}

module.exports = function () {
    coreValidator();
    if (appValidator) appValidator();
};
