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
        'domain': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': false
        },
        'ip': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': false
        },
        'browser': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': false
        },
        'version': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': false
        },
        'deviceModel': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'deviceType': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'deviceVendor': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'engineName': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'engineVersion': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'osName': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'osVersion': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'userAgent': {
            'type': Sequelize.TEXT('long'),
            'allowNull': true
        },
        'count': {
            'type': Sequelize.INTEGER,
            'allowNull': false,
            'defaultValue': 0
        }
    },
    'options': {
        'indexes': [{
            unique: true,
            fields: ['domain', 'ip', 'browser'],
            name: 'browser_count_domain_ip_browser'
        }],
        'timestamps': false,
        'charset': config.db.charset,
        'paranoid': false,
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            'upsertBrowserCount': function (body, callback) {

                var singleQuotationExp = new RegExp("'", 'gi');

                Object.keys(body).forEach(function (field) {
                    if (body[field]) {
                        body[field] = body[field].replace(singleQuotationExp, '');
                    }
                });

                var query = "INSERT INTO BrowserCounts (domain, ip, browser, version, deviceModel, deviceType, deviceVendor, engineName, engineVersion, osName, osVersion, userAgent, count) VALUES ('" + body.domain + "', '" + body.ip + "', '" + body.browser + "', '" + body.version + "', '" + body.deviceModel + "', '" + body.deviceType + "', '" + body.deviceVendor + "', '" + body.engineName + "', '" + body.engineVersion + "', '" + body.osName + "', '" + body.osVersion + "', '" + body.userAgent + "', 1) " +
                    "ON DUPLICATE KEY UPDATE domain = '" + body.domain + "', ip = '" + body.ip + "', browser = '" + body.browser + "', version = '" + body.version + "', deviceModel = '" + body.deviceModel + "', deviceType = '" + body.deviceType + "', deviceVendor = '" + body.deviceVendor + "', engineName = '" + body.engineName + "', engineVersion = '" + body.engineVersion + "', osName = '" + body.osName + "', osVersion = '" + body.osVersion + "', userAgent = '" + body.userAgent + "', count = count + 1";

                sequelize.query(query, {
                    type: sequelize.QueryTypes.UPSERT,
                    raw: true
                }).then(function (data) {
                    if (data.length > 1) {
                        return true;
                    }
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(204);
                    }
                });

            }
        })
    }
};