var STD = require('../../../../bridge/metadata/standards');
var errorHandler = require('sg-sequelize-error-handler');

module.exports = function () {

    function Lguplus() {
    }

    Lguplus.prototype.startPay = function () {
        return function (req, res, next) {

            var USER = req.meta.std.user;

            if (req.body.LGD_AMOUNT !== undefined) {
                req.check('LGD_AMOUNT', '400_5').isInt();
            }
            if (req.body.LGD_BUYER !== undefined) {
                req.check('LGD_BUYER', '400_51').len(USER.minNickLength, USER.maxNickLength);
            }
            if (req.body.LGD_PRODUCTINFO !== undefined) {
                req.check('LGD_PRODUCTINFO', '400_51').len(1, 1000);
            }
            if (req.body.LGD_BUYEREMAIL !== undefined) {
                req.check('LGD_BUYEREMAIL', '400_1').isEmail();
            }
            if (req.body.LGD_CUSTOM_USABLEPAY !== undefined) {
                req.check('LGD_CUSTOM_USABLEPAY', '400_8').len(6, 6);
            }

            req.utils.common.checkError(req, res, next);

        }
    };

    Lguplus.prototype.finishPay = function () {
        return function (req, res, next) {

            req.check('LGD_OID', '400_51').len(1, 1000);

            if (req.body.LGD_CARDACQUIRER !== undefined) {
                req.check('LGD_CARDACQUIRER', '400_5').isInt();
            }
            if (req.body.LGD_IFOS !== undefined) {
                req.check('LGD_IFOS', '400_51').len(1, 1000);
            }
            if (req.body.LGD_MID !== undefined) {
                req.check('LGD_MID', '400_51').len(1, 1000);
            }
            if (req.body.LGD_FINANCENAME !== undefined) {
                req.check('LGD_FINANCENAME', '400_51').len(1, 1000);
            }
            if (req.body.LGD_PCANCELFLAG !== undefined) {
                req.check('LGD_PCANCELFLAG', '400_51').len(1, 1000);
            }
            if (req.body.LGD_FINANCEAUTHNUM !== undefined) {
                req.check('LGD_FINANCEAUTHNUM', '400_51').len(1, 1000);
            }
            if (req.body.LGD_DELIVERYINFO !== undefined) {
                req.check('LGD_DELIVERYINFO', '400_51').len(1, 1000);
            }
            if (req.body.LGD_AFFILIATECODE !== undefined) {
                req.check('LGD_AFFILIATECODE', '400_51').len(1, 1000);
            }
            if (req.body.LGD_TRANSAMOUNT !== undefined) {
                req.check('LGD_TRANSAMOUNT', '400_51').len(1, 1000);
            }
            if (req.body.LGD_BUYERID !== undefined) {
                req.check('LGD_BUYERID', '400_51').len(1, 1000);
            }
            if (req.body.LGD_CARDNUM !== undefined) {
                req.check('LGD_CARDNUM', '400_51').len(1, 1000);
            }
            if (req.body.LGD_RECEIVERPHONE !== undefined) {
                req.check('LGD_RECEIVERPHONE', '400_51').len(1, 1000);
            }
            if (req.body.LGD_2TR_FLAG !== undefined) {
                req.check('LGD_2TR_FLAG', '400_51').len(1, 1000);
            }
            if (req.body.LGD_DEVICE !== undefined) {
                req.check('LGD_DEVICE', '400_51').len(1, 1000);
            }
            if (req.body.LGD_TID !== undefined) {
                req.check('LGD_TID', '400_51').len(1, 1000);
            }
            if (req.body.LGD_FINANCECODE !== undefined) {
                req.check('LGD_FINANCECODE', '400_51').len(1, 1000);
            }
            if (req.body.LGD_CARDNOINTYN !== undefined) {
                req.check('LGD_CARDNOINTYN', '400_51').len(1, 1000);
            }
            if (req.body.LGD_PCANCELSTR !== undefined) {
                req.check('LGD_PCANCELSTR', '400_51').len(1, 1000);
            }
            if (req.body.LGD_IDPKEY !== undefined) {
                req.check('LGD_IDPKEY', '400_51').len(1, 1000);
            }
            if (req.body.LGD_BUYERPHONE !== undefined) {
                req.check('LGD_BUYERPHONE', '400_51').len(1, 1000);
            }
            if (req.body.LGD_ESCROWYN !== undefined) {
                req.check('LGD_ESCROWYN', '400_51').len(1, 1000);
            }
            if (req.body.LGD_PAYTYPE !== undefined) {
                req.check('LGD_PAYTYPE', '400_51').len(1, 1000);
            }
            if (req.body.LGD_VANCODE !== undefined) {
                req.check('LGD_VANCODE', '400_51').len(1, 1000);
            }
            if (req.body.LGD_EXCHANGERATE !== undefined) {
                req.check('LGD_EXCHANGERATE', '400_51').len(1, 1000);
            }
            if (req.body.LGD_BUYERSSN !== undefined) {
                req.check('LGD_BUYERSSN', '400_51').len(1, 1000);
            }
            if (req.body.LGD_CARDINSTALLMONTH !== undefined) {
                req.check('LGD_CARDINSTALLMONTH', '400_51').len(1, 1000);
            }
            if (req.body.LGD_PAYDATE !== undefined) {
                req.check('LGD_PAYDATE', '400_51').len(1, 1000);
            }
            if (req.body.LGD_PRODUCTCODE !== undefined) {
                req.check('LGD_PRODUCTCODE', '400_51').len(1, 1000);
            }
            if (req.body.LGD_HASHDATA !== undefined) {
                req.check('LGD_HASHDATA', '400_51').len(1, 1000);
            }
            if (req.body.LGD_CARDGUBUN1 !== undefined) {
                req.check('LGD_CARDGUBUN1', '400_51').len(1, 1000);
            }
            if (req.body.LGD_CARDGUBUN2 !== undefined) {
                req.check('LGD_CARDGUBUN2', '400_51').len(1, 1000);
            }
            if (req.body.LGD_BUYERADDRESS !== undefined) {
                req.check('LGD_BUYERADDRESS', '400_51').len(1, 1000);
            }
            if (req.body.LGD_RECEIVER !== undefined) {
                req.check('LGD_RECEIVER', '400_51').len(1, 1000);
            }
            if (req.body.LGD_RESPCODE !== undefined) {
                req.check('LGD_RESPCODE', '400_51').len(1, 1000);
            }
            if (req.body.LGD_RESPMSG !== undefined) {
                req.check('LGD_RESPCODE', '400_51').len(1, 1000);
            }

            if (req.body.LGD_CARDNOINTEREST_YN !== undefined) {
                req.check('LGD_CARDNOINTEREST_YN', '400_51').len(1, 1000);
            }
            if (req.body.LGD_DISCOUNTUSEYN !== undefined) {
                req.check('LGD_DISCOUNTUSEYN', '400_51').len(1, 1000);
            }
            if (req.body.LGD_ISPKEY !== undefined) {
                req.check('LGD_ISPKEY', '400_51').len(1, 1000);
            }
            if (req.body.LGD_DISCOUNTUSEAMOUNT !== undefined) {
                req.check('LGD_DISCOUNTUSEAMOUNT', '400_5').isInt();
            }

            if (req.body.LGD_AMOUNT !== undefined) {
                req.check('LGD_AMOUNT', '400_5').isInt();
            }
            if (req.body.LGD_BUYER !== undefined) {
                req.check('LGD_BUYER', '400_51').len(1, 1000);
            }
            if (req.body.LGD_PRODUCTINFO !== undefined) {
                req.check('LGD_PRODUCTINFO', '400_51').len(1, 1000);
            }
            if (req.body.LGD_TIMESTAMP !== undefined) {
                req.check('LGD_TIMESTAMP', '400_51').len(1, 1000);
            }

            req.utils.common.checkError(req, res, next);
        }
    };

    return new Lguplus();
};