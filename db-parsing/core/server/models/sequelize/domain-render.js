/**
 * Test model module.
 * @module core/server/models/sequelize/test
 */

var Sequelize = require('sequelize');
var sequelize = require('../../../../core/server/config/sequelize');
var STD = require('../../../../bridge/metadata/standards');
var LOCAL = require('../../../../bridge/metadata/localization');
var mixin = require('./mixin');
var errorHandler = require('sg-sequelize-error-handler');

var PAGE_UTIL = require('../../utils/page');
var config = require('../../../../bridge/config/env');
var coreUtils = require("../../../../core/server/utils");

module.exports = {
    fields: {
        'domain': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': false,
            'unique': true
        },
        'render': {
            'type': Sequelize.ENUM,
            'values': PAGE_UTIL.getPages(),
            'allowNull': false
        },
        'language': {
            'type': Sequelize.ENUM,
            'values': Object.keys(LOCAL.languages),
            'allowNull': false
        },
        'country': {
            'type': Sequelize.ENUM,
            'values': Object.keys(LOCAL.countries),
            'allowNull': false
        }
    },
    options: {
        'timestamps': true,
        'charset': config.db.charset,
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {

        }),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            "findRender": function (domain, callback) {
                var render = null;
                sequelize.models.DomainRender.findOne({
                    where: {
                        domain: domain
                    }
                }).then(function (data) {
                    if (data) {
                        render = data.render;
                        return true;
                    } else {
                        throw new errorHandler.CustomSequelizeError(404);
                    }
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(200, render);
                    }
                });
            }
        })
    }
};
