/**
 * 응답콜백
 * @callback responseCallback
 * @param {number} status - 상태코드
 * @param {Object} data - 성공일 경우 반환된 데이터
 */

var Sequelize = require('sequelize');
var sequelize = require('../../../../core/server/config/sequelize');

var mixin = require('../../../../core/server/models/sequelize/mixin');
var errorHandler = require('sg-sequelize-error-handler');

var STD = require('../../../../bridge/metadata/standards');
var coreUtils = require('../../utils');

var micro = require('microtime-nodejs');
var config = require('../../../../bridge/config/env');
var coreUtils = require("../../../../core/server/utils");

module.exports = {
    fields: {
        'status': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': false
        },
        'LGD_TID': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'LGD_OID': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': false
        },
        'LGD_AMOUNT': {
            'type': Sequelize.INTEGER,
            'allowNull': false
        },
        'LGD_BUYER': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': false
        },
        'LGD_PRODUCTINFO': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': false
        },
        'LGD_BUYEREMAIL': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'LGD_TIMESTAMP': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': false
        },
        'LGD_CUSTOM_USABLEPAY': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': false
        },
        'LGD_CARDACQUIRER': {
            'type': Sequelize.INTEGER,
            'allowNull': true
        },
        'LGD_IFOS': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'LGD_MID': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'LGD_FINANCENAME': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'LGD_PCANCELFLAG': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'LGD_FINANCEAUTHNUM': {
            'type': Sequelize.INTEGER,
            'allowNull': true
        },
        'LGD_DELIVERYINFO': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'LGD_AFFILIATECODE': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'LGD_TRANSAMOUNT': {
            'type': Sequelize.INTEGER,
            'allowNull': true
        },
        'LGD_BUYERID': {
            'type': Sequelize.INTEGER,
            'allowNull': true
        },
        'LGD_CARDNUM': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'LGD_RECEIVERPHONE': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'LGD_2TR_FLAG': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'LGD_DEVICE': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'LGD_FINANCECODE': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'LGD_CARDNOINTYN': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'LGD_PCANCELSTR': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'LGD_IDPKEY': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'LGD_BUYERPHONE': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'LGD_ESCROWYN': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'LGD_PAYTYPE': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'LGD_VANCODE': {
            'type': Sequelize.INTEGER,
            'allowNull': true
        },
        'LGD_EXCHANGERATE': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'LGD_BUYERSSN': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'LGD_CARDINSTALLMONTH': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'LGD_PAYDATE': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'LGD_PRODUCTCODE': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'LGD_HASHDATA': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'LGD_CARDGUBUN1': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'LGD_CARDGUBUN2': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'LGD_BUYERADDRESS': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'LGD_RECEIVER': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'LGD_RESPCODE': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'LGD_RESPMSG': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'LGD_CARDNOINTEREST_YN': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'LGD_DISCOUNTUSEYN': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'LGD_ISPKEY': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'LGD_DISCOUNTUSEAMOUNT': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
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
        'timestamps': true,
        'createdAt': false,
        'updatedAt': false,
        'paranoid': true,
        'charset': config.db.charset,
        'hooks': {
            'beforeCreate': mixin.options.hooks.microCreatedAt,
            'beforeBulkUpdate': mixin.options.hooks.useIndividualHooks,
            'beforeUpdate': mixin.options.hooks.microUpdatedAt
        },
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            // 'startPay': function (body, t) {
            //
            //     var LGUPLUS = STD.pay.lguplus;
            //
            //     body.status = LGUPLUS.statusWait;
            //
            //     var timestamp = micro.now();
            //     body.LGD_OID = 'sg' + timestamp;
            //     body.LGD_TIMESTAMP = timestamp;
            //
            //     return sequelize.models.Lguplus.create(body, {
            //         transaction: t
            //     }).then(function (data) {
            //         if (data) {
            //             return data;
            //         } else {
            //             throw new errorHandler.CustomSequelizeError(404);
            //         }
            //     });
            // },
            // 'finishPay': function (LGD_OID, update, t) {
            //
            //     var LGUPLUS = STD.pay.lguplus;
            //
            //     update.status = LGUPLUS.statusFinish;
            //
            //     return sequelize.models.Lguplus.update(update, {
            //         where: {
            //             'LGD_OID': LGD_OID
            //         },
            //         transaction: t
            //     }).then(function (data) {
            //         if (data[0] > 0) {
            //             return true;
            //         } else {
            //             throw new errorHandler.CustomSequelizeError(404);
            //         }
            //     });
            // }
        })
    }
};