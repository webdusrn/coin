
var env = require('../../../bridge/config/env');
var SESSION_PREFIX = 'slogupSessionId';
var sessionStore = require('../config/express').sessionSetting.store;
var std = require('../../../bridge/metadata/standards');


var socketUtils = {};

module.exports = socketUtils;