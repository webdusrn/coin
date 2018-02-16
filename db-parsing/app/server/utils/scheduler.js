var STD = require('../../../bridge/metadata/standards');
var cron = require('node-cron');
var sequelize = require('../../../core/server/config/sequelize');
var errorHandler = require('sg-sequelize-error-handler');

var requestMinutes = [];
for (var i=0; i<60; i++) {
    requestMinutes.push(i);
}
requestMinutes = requestMinutes.join(',');

var requestSeconds = requestMinutes;

var requestHours = [];
for (var i=0; i<24; i++) {
    requestHours.push(i);
}
requestHours = requestHours.join(',');

var requestFiveSeconds = [];
for (var i=0; i<12; i++) {
    requestFiveSeconds.push(i * 5);
}

requestFiveSeconds = requestFiveSeconds.join(',');

var requestSpecialHours = [9, 10, 11, 12];
requestSpecialHours = requestSpecialHours.join(',');

module.exports = {
    run: function () {
        if (process.env.CRON_ENV == 'cron') {

        } else {

        }
    }
};