var STD = require('../../../../bridge/metadata/standards');

module.exports = {
    startValidate: function (req, res, next) {

        var USER = req.meta.std.user;
        var PG_PURCHASE = req.meta.std.pgPurchase;

        var pgPurchase = {
            userId: req.user.id,
            pgType: PG_PURCHASE.pgTypeLguplus
        };

        if (req.body.LGD_AMOUNT !== undefined) {
            req.check('LGD_AMOUNT', '400_5').isInt();

            pgPurchase.price = req.body.LGD_AMOUNT;
        }
        if (req.body.LGD_BUYER !== undefined) {
            req.check('LGD_BUYER', '400_51').len(USER.minNickLength, USER.maxNickLength);

            pgPurchase.userName = req.body.LGD_BUYER;
        }
        if (req.body.LGD_PRODUCTINFO !== undefined) {
            req.check('LGD_PRODUCTINFO', '400_51').len(1, 1000);

            pgPurchase.productName = req.body.LGD_PRODUCTINFO;
        }
        if (req.body.LGD_BUYEREMAIL !== undefined) {
            req.check('LGD_BUYEREMAIL', '400_1').isEmail();

            pgPurchase.email = req.body.LGD_BUYER;
        }
        if (req.body.LGD_CUSTOM_USABLEPAY !== undefined) {
            req.check('LGD_CUSTOM_USABLEPAY', '400_8').len(6, 6);
        }

        req.body.pgPurchase = pgPurchase;

        req.utils.common.checkError(req, res, next);

    },
    finishValidate: function (req, res, next) {

        var pgPurchase = {
            payload: {}
        };

        req.check('LGD_OID', '400_51').len(1, 1000);
        pgPurchase.orderNo = req.body.LGD_OID;

        // req.check('LGD_BUYERID', '400_51').len(1, 1000);
        // pgPurchase.userId = req.body.LGD_BUYERID;

        if (req.body.LGD_CARDACQUIRER !== undefined) {
            req.check('LGD_CARDACQUIRER', '400_5').isInt();

            pgPurchase.payload.LGD_CARDACQUIRER = req.body.LGD_CARDACQUIRER;
        }
        if (req.body.LGD_IFOS !== undefined) {
            req.check('LGD_IFOS', '400_51').len(1, 1000);

            pgPurchase.payload.LGD_IFOS = req.body.LGD_IFOS;
        }
        if (req.body.LGD_MID !== undefined) {
            req.check('LGD_MID', '400_51').len(1, 1000);

            pgPurchase.payload.LGD_IFOS = req.body.LGD_IFOS;
        }
        if (req.body.LGD_FINANCENAME !== undefined) {
            req.check('LGD_FINANCENAME', '400_51').len(1, 1000);

            pgPurchase.payload.LGD_FINANCENAME = req.body.LGD_FINANCENAME;
        }
        if (req.body.LGD_PCANCELFLAG !== undefined) {
            req.check('LGD_PCANCELFLAG', '400_51').len(1, 1000);

            pgPurchase.payload.LGD_PCANCELFLAG = req.body.LGD_PCANCELFLAG;
        }
        if (req.body.LGD_FINANCEAUTHNUM !== undefined) {
            req.check('LGD_FINANCEAUTHNUM', '400_51').len(1, 1000);

            pgPurchase.payload.LGD_FINANCEAUTHNUM = req.body.LGD_FINANCEAUTHNUM;
        }
        if (req.body.LGD_DELIVERYINFO !== undefined) {
            req.check('LGD_DELIVERYINFO', '400_51').len(1, 1000);

            pgPurchase.payload.LGD_DELIVERYINFO = req.body.LGD_DELIVERYINFO;
        }
        if (req.body.LGD_AFFILIATECODE !== undefined) {
            req.check('LGD_AFFILIATECODE', '400_51').len(1, 1000);

            pgPurchase.payload.LGD_AFFILIATECODE = req.body.LGD_AFFILIATECODE;
        }
        if (req.body.LGD_TRANSAMOUNT !== undefined) {
            req.check('LGD_TRANSAMOUNT', '400_51').len(1, 1000);

            pgPurchase.payload.LGD_TRANSAMOUNT = req.body.LGD_TRANSAMOUNT;
        }
        if (req.body.LGD_CARDNUM !== undefined) {
            req.check('LGD_CARDNUM', '400_51').len(1, 1000);

            pgPurchase.payload.LGD_CARDNUM = req.body.LGD_CARDNUM;
        }
        if (req.body.LGD_RECEIVERPHONE !== undefined) {
            req.check('LGD_RECEIVERPHONE', '400_51').len(1, 1000);

            pgPurchase.payload.LGD_RECEIVERPHONE = req.body.LGD_RECEIVERPHONE;
        }
        if (req.body.LGD_2TR_FLAG !== undefined) {
            req.check('LGD_2TR_FLAG', '400_51').len(1, 1000);

            pgPurchase.payload.LGD_2TR_FLAG = req.body.LGD_2TR_FLAG;
        }
        if (req.body.LGD_DEVICE !== undefined) {
            req.check('LGD_DEVICE', '400_51').len(1, 1000);

            pgPurchase.payload.LGD_DEVICE = req.body.LGD_DEVICE;
        }
        if (req.body.LGD_TID !== undefined) {
            req.check('LGD_TID', '400_51').len(1, 1000);

            pgPurchase.transactionNo = req.body.LGD_TID;
        }
        if (req.body.LGD_FINANCECODE !== undefined) {
            req.check('LGD_FINANCECODE', '400_51').len(1, 1000);

            pgPurchase.payload.LGD_FINANCECODE = req.body.LGD_FINANCECODE;
        }
        if (req.body.LGD_CARDNOINTYN !== undefined) {
            req.check('LGD_CARDNOINTYN', '400_51').len(1, 1000);

            pgPurchase.payload.LGD_CARDNOINTYN = req.body.LGD_CARDNOINTYN;
        }
        if (req.body.LGD_PCANCELSTR !== undefined) {
            req.check('LGD_PCANCELSTR', '400_51').len(1, 1000);

            pgPurchase.payload.LGD_PCANCELSTR = req.body.LGD_PCANCELSTR;
        }
        if (req.body.LGD_IDPKEY !== undefined) {
            req.check('LGD_IDPKEY', '400_51').len(1, 1000);

            pgPurchase.payload.LGD_IDPKEY = req.body.LGD_IDPKEY;
        }
        if (req.body.LGD_BUYERPHONE !== undefined) {
            req.check('LGD_BUYERPHONE', '400_51').len(1, 1000);

            pgPurchase.payload.LGD_BUYERPHONE = req.body.LGD_BUYERPHONE;
        }
        if (req.body.LGD_ESCROWYN !== undefined) {
            req.check('LGD_ESCROWYN', '400_51').len(1, 1000);

            pgPurchase.payload.LGD_ESCROWYN = req.body.LGD_ESCROWYN;
        }
        if (req.body.LGD_PAYTYPE !== undefined) {
            req.check('LGD_PAYTYPE', '400_51').len(1, 1000);

            pgPurchase.payload.LGD_PAYTYPE = req.body.LGD_PAYTYPE;
        }
        if (req.body.LGD_VANCODE !== undefined) {
            req.check('LGD_VANCODE', '400_51').len(1, 1000);

            pgPurchase.payload.LGD_VANCODE = req.body.LGD_VANCODE;
        }
        if (req.body.LGD_EXCHANGERATE !== undefined) {
            req.check('LGD_EXCHANGERATE', '400_51').len(1, 1000);

            pgPurchase.payload.LGD_EXCHANGERATE = req.body.LGD_EXCHANGERATE;
        }
        if (req.body.LGD_BUYERSSN !== undefined) {
            req.check('LGD_BUYERSSN', '400_51').len(1, 1000);

            pgPurchase.payload.LGD_BUYERSSN = req.body.LGD_BUYERSSN;
        }
        if (req.body.LGD_CARDINSTALLMONTH !== undefined) {
            req.check('LGD_CARDINSTALLMONTH', '400_51').len(1, 1000);

            pgPurchase.payload.LGD_CARDINSTALLMONTH = req.body.LGD_CARDINSTALLMONTH;
        }
        if (req.body.LGD_PAYDATE !== undefined) {
            req.check('LGD_PAYDATE', '400_51').len(1, 1000);

            pgPurchase.payload.LGD_PAYDATE = req.body.LGD_PAYDATE;
        }
        if (req.body.LGD_PRODUCTCODE !== undefined) {
            req.check('LGD_PRODUCTCODE', '400_51').len(1, 1000);

            pgPurchase.payload.LGD_PRODUCTCODE = req.body.LGD_PRODUCTCODE;
        }
        if (req.body.LGD_HASHDATA !== undefined) {
            req.check('LGD_HASHDATA', '400_51').len(1, 1000);

            pgPurchase.payload.LGD_HASHDATA = req.body.LGD_HASHDATA;
        }
        if (req.body.LGD_CARDGUBUN1 !== undefined) {
            req.check('LGD_CARDGUBUN1', '400_51').len(1, 1000);

            pgPurchase.payload.LGD_CARDGUBUN1 = req.body.LGD_CARDGUBUN1;
        }
        if (req.body.LGD_CARDGUBUN2 !== undefined) {
            req.check('LGD_CARDGUBUN2', '400_51').len(1, 1000);

            pgPurchase.payload.LGD_CARDGUBUN2 = req.body.LGD_CARDGUBUN2;
        }
        if (req.body.LGD_BUYERADDRESS !== undefined) {
            req.check('LGD_BUYERADDRESS', '400_51').len(1, 1000);

            pgPurchase.payload.LGD_BUYERADDRESS = req.body.LGD_BUYERADDRESS;
        }
        if (req.body.LGD_RECEIVER !== undefined) {
            req.check('LGD_RECEIVER', '400_51').len(1, 1000);

            pgPurchase.payload.LGD_RECEIVER = req.body.LGD_RECEIVER;
        }
        if (req.body.LGD_RESPCODE !== undefined) {
            req.check('LGD_RESPCODE', '400_51').len(1, 1000);

            pgPurchase.payload.LGD_RESPCODE = req.body.LGD_RESPCODE;
        }
        if (req.body.LGD_RESPMSG !== undefined) {
            req.check('LGD_RESPCODE', '400_51').len(1, 1000);

            pgPurchase.payload.LGD_RESPMSG = req.body.LGD_RESPMSG;
        }

        if (req.body.LGD_CARDNOINTEREST_YN !== undefined) {
            req.check('LGD_CARDNOINTEREST_YN', '400_51').len(1, 1000);

            pgPurchase.payload.LGD_CARDNOINTEREST_YN = req.body.LGD_CARDNOINTEREST_YN;
        }
        if (req.body.LGD_DISCOUNTUSEYN !== undefined) {
            req.check('LGD_DISCOUNTUSEYN', '400_51').len(1, 1000);

            pgPurchase.payload.LGD_DISCOUNTUSEYN = req.body.LGD_DISCOUNTUSEYN;
        }
        if (req.body.LGD_ISPKEY !== undefined) {
            req.check('LGD_ISPKEY', '400_51').len(1, 1000);

            pgPurchase.payload.LGD_ISPKEY = req.body.LGD_ISPKEY;
        }
        if (req.body.LGD_DISCOUNTUSEAMOUNT !== undefined) {
            req.check('LGD_DISCOUNTUSEAMOUNT', '400_5').isInt();

            pgPurchase.payload.LGD_DISCOUNTUSEAMOUNT = req.body.LGD_DISCOUNTUSEAMOUNT;
        }

        if (req.body.LGD_AMOUNT !== undefined) {
            req.check('LGD_AMOUNT', '400_5').isInt();

            pgPurchase.price = req.body.LGD_AMOUNT;
        }
        if (req.body.LGD_BUYER !== undefined) {
            req.check('LGD_BUYER', '400_51').len(1, 1000);

            pgPurchase.userName = req.body.LGD_BUYER;
        }
        if (req.body.LGD_PRODUCTINFO !== undefined) {
            req.check('LGD_PRODUCTINFO', '400_51').len(1, 1000);

            pgPurchase.productName = req.body.LGD_PRODUCTINFO;
        }
        if (req.body.LGD_TIMESTAMP !== undefined) {
            req.check('LGD_TIMESTAMP', '400_51').len(1, 1000);

            pgPurchase.payload.LGD_TIMESTAMP = req.body.LGD_TIMESTAMP;
        }

        req.body.pgPurchase = pgPurchase;

        req.utils.common.checkError(req, res, next);
    },
};