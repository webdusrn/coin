
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
        'state': {
            'type': Sequelize.STRING(getDBStringLength()),
            'defaultValue': STD.taxInvoice.defaultState,
            'allowNull': false
        },
        'chargeDirection': {
            'type': Sequelize.STRING(getDBStringLength()),
            'defaultValue': STD.taxInvoice.defaultChargeDirection,
            'allowNull': false
        },
        'issueType': {
            'type': Sequelize.STRING(getDBStringLength()),
            'defaultValue': STD.taxInvoice.defaultIssueType,
            'allowNull': false
        },
        'purposeType': {
            'type': Sequelize.STRING(getDBStringLength()),
            'defaultValue': STD.taxInvoice.defaultPurposeType,
            'allowNull': false
        },
        'taxType': {
            'type': Sequelize.STRING(getDBStringLength()),
            'defaultValue': STD.taxInvoice.defaultTaxType,
            'allowNull': false
        },

        'invoicerCorpNum': {
            'type': Sequelize.STRING(getDBStringLength()),
            'allowNull': false,
            'comment': "[필수] 공급자 사업자번호, '-' 제외 10자리"
        },
        'invoicerCorpName': {
            'type': Sequelize.STRING(getDBStringLength()),
            'allowNull': false,
            'comment': "[필수] 공급자 상호"
        },
        'invoicerCEOName': {
            'type': Sequelize.STRING(getDBStringLength()),
            'allowNull': false,
            'comment': "[필수] 대표자 성명"
        },
        'invoicerAddr': {
            'type': Sequelize.STRING(getDBStringLength()),
            'allowNull': true,
            'comment': "공급자 주소"
        },
        'invoicerBizClass': {
            'type': Sequelize.STRING(getDBStringLength()),
            'allowNull': true,
            'comment': "공급자 종목"
        },
        'invoicerBizType': {
            'type': Sequelize.STRING(getDBStringLength()),
            'allowNull': true,
            'comment': "공급자 업태"
        },
        'invoicerContactName': {
            'type': Sequelize.STRING(getDBStringLength()),
            'allowNull': true,
            'comment': "공급자 담당자명"
        },
        'invoicerTEL': {
            'type': Sequelize.STRING(getDBStringLength()),
            'allowNull': true,
            'comment': "공급자 연락처"
        },
        'invoicerHP': {
            'type': Sequelize.STRING(getDBStringLength()),
            'allowNull': true,
            'comment': "공급자 휴대폰번호"
        },
        'invoicerEmail': {
            'type': Sequelize.STRING(getDBStringLength()),
            'allowNull': true,
            'comment': "공급자 메일주소"
        },

        'invoiceeType': {
            'type': Sequelize.STRING(getDBStringLength()),
            'defaultValue': STD.taxInvoice.defaultInvoiceeType,
            'allowNull': false,
            'comment': "[필수] 공급받는자 구분, (사업자, 개인, 외국인) 중 기재"
        },
        'invoiceeCorpNum': {
            'type': Sequelize.STRING(getDBStringLength()),
            'allowNull': false,
            'comment': "[필수] 공급받는자 사업자번호, '-'제외 10자리"
        },
        'invoiceeCorpName': {
            'type': Sequelize.STRING(getDBStringLength()),
            'allowNull': false,
            'comment': "[필수] 공급받는자 상호"
        },
        'invoiceeCEOName': {
            'type': Sequelize.STRING(getDBStringLength()),
            'allowNull': false,
            'comment': "[필수] 공급받는자 대표자 성명"
        },
        'invoiceeAddr': {
            'type': Sequelize.STRING(getDBStringLength()),
            'allowNull': true,
            'comment': "공급받는자 주소"
        },
        'invoiceeBizClass': {
            'type': Sequelize.STRING(getDBStringLength()),
            'allowNull': true,
            'comment': "공급받는자 종목"
        },
        'invoiceeBizType': {
            'type': Sequelize.STRING(getDBStringLength()),
            'allowNull': true,
            'comment': "공급받는자 업태"
        },
        'invoiceeContactName1': {
            'type': Sequelize.STRING(getDBStringLength()),
            'allowNull': true,
            'comment': "공급받는자 담당자명"
        },
        'invoiceeTEL1': {
            'type': Sequelize.STRING(getDBStringLength()),
            'allowNull': true,
            'comment': "공급받는자 연락처"
        },
        'invoiceeHP1': {
            'type': Sequelize.STRING(getDBStringLength()),
            'allowNull': true,
            'comment': "공급받는자 휴대폰번호"
        },
        'invoiceeEmail1': {
            'type': Sequelize.STRING(getDBStringLength()),
            'allowNull': true,
            'comment': "공급받는자 이메일 주소"
        },

        'invoiceeContactName2': {
            'type': Sequelize.STRING(getDBStringLength()),
            'allowNull': true,
            'comment': "공급받는자 담당자명"
        },
        'invoiceeEmail2': {
            'type': Sequelize.STRING(getDBStringLength()),
            'allowNull': true,
            'comment': "공급받는자 담당자 메일"
        },
        'invoiceeContactName3': {
            'type': Sequelize.STRING(getDBStringLength()),
            'allowNull': true,
            'comment': "공급받는자 담당자명"
        },
        'invoiceeEmail3': {
            'type': Sequelize.STRING(getDBStringLength()),
            'allowNull': true,
            'comment': "공급받는자 담당자 메일"
        },

        'supplyCostTotal': {
            'type': Sequelize.INTEGER,
            'defaultValue': 0,
            'allowNull': false,
            'comment': "[필수] 공급가액 합계"
        },
        'taxTotal': {
            'type': Sequelize.INTEGER,
            'defaultValue': 0,
            'allowNull': false,
            'comment': "[필수] 세액합계"
        },
        'totalAmount': {
            'type': Sequelize.INTEGER,
            'defaultValue': 0,
            'allowNull': false,
            'comment': "[필수] 합계금액 (공급가액 합계 + 세액 합계)"
        },

        'cash': {
            'type': Sequelize.INTEGER,
            'allowNull': true,
            'comment': "기재 상 '현금' 항목"
        },
        'chkBill': {
            'type': Sequelize.INTEGER,
            'allowNull': true,
            'comment': "기재 상 '수표' 항목"
        },
        'note': {
            'type': Sequelize.INTEGER,
            'allowNull': true,
            'comment': "기재 상 '어음' 항목"
        },
        'credit': {
            'type': Sequelize.INTEGER,
            'allowNull': true,
            'comment': "기재 상 '외상' 항목"
        },
        'remark1': {
            'type': Sequelize.TEXT('long'),
            'allowNull': true,
            'comment': '비고'
        },

        'publishedAt': {
            'type': Sequelize.BIGINT,
            'allowNull': true
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
            name: 'state',
            fields: ['state']
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