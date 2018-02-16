
var path = require('path');
var fs = require('fs');
var sequelize = require('../../../../core/server/config/sequelize');
var Profile = require('./profile');
var AppMeta = require('./app-meta');

var models = {
    Profile: Profile,
    AppMeta: AppMeta


};

module.exports = models;