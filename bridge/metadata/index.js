var utils = require('../utils');
var std = require('./standards');
var stdLocal = require('./standards-local');

module.exports.std = std;
module.exports.codes = require('./codes');
module.exports.langs = require('./languages');
module.exports.local = require('./localization');
module.exports.stdLocal = stdLocal;
module.exports.notifications = require('./notifications');