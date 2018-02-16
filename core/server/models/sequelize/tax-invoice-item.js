
/**
 * 응답콜백
 * @callback responseCallback
 * @param {number} status - 상태코드
 * @param {Object} data - 성공일 경우 반환된 데이터
 */

var Sequelize = require('sequelize');
var sequelize = require('../../../server/config/sequelize');

var mixin = require('../../../server/models/sequelize/mixin');
var errorHandler = require('sg-sequelize-error-handler');

var STD = require('../../../../bridge/metadata/standards');
var LOCAL = require('../../../../bridge/metadata/localization');
var CONFIG = require('../../../../bridge/config/env');
var getDBStringLength = require('../../../server/utils').initialization.getDBStringLength;
module.exports = {
    fields: {
        'taxInvoiceId': {
            'reference': 'TaxInvoice',
            'referenceKey': 'id',
            'as': 'taxInvoice',
            'asReverse': 'taxInvoiceItems',
            'allowNull': false
        },
        'serialNum': {
            'type': Sequelize.INTEGER,
            'defaultValue': 1,
            'allowNull': false,
            'comment': '일련번호, 1부터 순차기재'
        },
        'purchaseDT': {
            'type': Sequelize.STRING(getDBStringLength()),
            'allowNull': false,
            'comment': '거래일자, 형식 : yyyyMMdd'
        },
        'itemName': {
            'type': Sequelize.STRING(getDBStringLength()),
            'allowNull': false,
            'comment': '품명'
        },
        'spec': {
            'type': Sequelize.STRING(getDBStringLength()),
            'allowNull': true,
            'comment': '규격'
        },
        'qty': {
            'type': Sequelize.FLOAT,
            'allowNull': false,
            'comment': '수량, 소수점 2자리까지 기재 가능'
        },
        'unitCost': {
            'type': Sequelize.FLOAT,
            'allowNull': false,
            'comment': '단가, 소수점 2자리까지 기재 가능'
        },
        'supplyCost': {
            'type': Sequelize.INTEGER,
            'allowNull': false,
            'comment': '공급가액, 소수점 기재불가, 원단위 이하는 절사하여 표현'
        },
        'tax': {
            'type': Sequelize.INTEGER,
            'allowNull': false,
            'comment': '세액, 소수점 기재불가, 원단위 이하는 절사하여 표현'
        },
        'remark': {
            'type': Sequelize.STRING(getDBStringLength()),
            'allowNull': true,
            'comment': '비고'
        },
        'createdAt': {
            'type': Sequelize.BIGINT,
            'allowNull': true
        },
        'updatedAt': {
            'type': Sequelize.BIGINT,
            'allowNull': true
        },
        'deletedAt': {
            'type': Sequelize.DATE,
            'allowNull': true
        }
    },
    options: {
        'indexes': [{
            name: 'taxInvoiceId',
            fields: ['taxInvoiceId']
        }, {
            name: 'createdAt',
            fields: ['createdAt']
        }],
        'timestamps': true,
        'createdAt': false,
        'updatedAt': false,
        'paranoid': true,
        'charset': CONFIG.db.charset,
        'collate': CONFIG.db.collate,
        'hooks': {
            'beforeCreate': mixin.options.hooks.microCreatedAt,
            'beforeBulkUpdate': mixin.options.hooks.useIndividualHooks,
            'beforeUpdate': mixin.options.hooks.microUpdatedAt
        },
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {

        })
    }
};