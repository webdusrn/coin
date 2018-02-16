/**
 * Profile model module.
 * @module core/server/models/sequelize/profile
 */

/**
 * 응답콜백
 * @callback responseCallback
 * @param {number} status - 상태코드
 * @param {Object} data - 성공일 경우 반환된 데이터
 */

var Sequelize = require('sequelize');
var sequelize = require('../../config/sequelize');
var MICRO = require('microtime-nodejs');

var mixin = require('./mixin');
var errorHandler = require('sg-sequelize-error-handler');
var UAParser = require('ua-parser-js');

var STD = require('../../../../bridge/metadata/standards');
var config = require('../../../../bridge/config/env');
var coreUtils = require("../../../../core/server/utils");

module.exports = {
    'fields': {
        'year': {
            'type': Sequelize.INTEGER,
            'allowNull': false
        },
        'month': {
            'type': Sequelize.INTEGER,
            'allowNull': false
        },
        'day': {
            'type': Sequelize.INTEGER,
            'allowNull': false
        },
        'count': {
            'type': Sequelize.INTEGER,
            'allowNull': false,
            'defaultValue': STD.dashboard.defaultCount
        }
    },
    'options': {
        'indexes': [{
            unique: true,
            fields: ['year', 'month', 'day'],
            name: 'login_count_year_month_day'
        }],
        'timestamps': false,
        'charset': config.db.charset,
        'paranoid': false,
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            "upsertLoginCount": function (date, callback) {
                var transaction = null;
                var loginCount = null;
                var body = {
                    year: date.getFullYear(),
                    month: date.getMonth() + 1,
                    day: date.getDate()
                };

                sequelize.models.LoginCount.findOne({
                    where: body
                }).then(function (data) {
                    if (data) {
                        loginCount = data;
                        body.count = loginCount.count + 1;
                    }
                    return sequelize.models.LoginCount.upsert(body);
                }).then(function () {
                    transaction = true;
                }).catch(errorHandler.catchCallback(callback)).done(function () {
                    if (transaction) {
                        callback(204);
                    }
                });
            }
        })
    }
};