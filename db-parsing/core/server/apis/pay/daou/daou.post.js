var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var MICRO = require('microtime-nodejs');
post.validate = function () {
    return function (req, res, next) {
        req.check('CPID', '400_8').len(1, 20);
        req.check('PRODUCTTYPE', '400_8').isEnum(["1", "2"]);
        req.check('TAXFREECD', '400_8').isEnum(["00", "01"]);
        req.check('AMOUNT', '400_8').isInt();
        req.check('QUOTAOPT', '400_8').isInt();
        req.check('PRODUCTNAME', '400_8').len(1, 50);
        if (req.body.EMAIL !== undefined) req.check('EMAIL', '400_8').isEmail().len(1, 100);
        if (req.body.USERID !== undefined) req.check('USERID', '400_8').len(1, 30);
        if (req.body.USERNAME !== undefined) req.check('USERNAME', '400_8').len(1, 50);
        if (req.body.PRODUCTCODE !== undefined) req.check('PRODUCTCODE', '400_8').len(1, 10);
        if (req.body.RESERVEDINDEX1 !== undefined) req.check('RESERVEDINDEX1', '400_8').len(1, 20);
        if (req.body.RESERVEDINDEX2 !== undefined) req.check('RESERVEDINDEX2', '400_8').len(1, 20);
        if (req.body.RESERVEDSTRING !== undefined) req.check('RESERVEDSTRING', '400_8').len(1, 1000);
        if (req.body.RETURNURL !== undefined) req.check('RETURNURL', '400_8').isUrl();
        if (req.body.HOMEURL !== undefined) req.check('HOMEURL', '400_8').isUrl();
        if (req.body.DIRECTRESULTFLAG !== undefined) req.check('DIRECTRESULTFLAG', '400_8').isEnum(["Y", "N"]);
        if (req.body.used_card_YN !== undefined) req.check('used_card_YN', '400_8').isEnum(["Y", "N"]);
        if (req.body.used_card !== undefined) req.check('used_card', '400_8').len(0, 10000);
        if (req.body.not_used_card !== undefined) req.check('not_used_card', '400_8').len(0, 10000);
        if (req.body.kcp_site_logo !== undefined) req.check('kcp_site_logo', '400_8');
        if (req.body.kcp_site_img !== undefined) req.check('kcp_site_img', '400_8');
        req.utils.common.checkError(req, res, next);
    };
};

post.setParam = function () {
    return function (req, res, next) {

        if (process.env.NODE_ENV == "production") {
            req.daouUrl = "https://ssl.daoupay.com/creditCard/DaouCreditCardMng.jsp";
        } else {
            req.daouUrl = "https://ssltest.daoupay.com/creditCard/DaouCreditCardMng.jsp";
        }
        req.body.ORDERNO = MICRO.now();
        req.body.BILLTYPE = "1";

        var request = require('request');
        request.post({url:req.daouUrl, formData: req.body}, function (err, httpResponse, body) {
            if (err) {
                return console.error('upload failed:', err);
            }
            req.daouResponse = body;
            console.log('Upload successful!  Server responded with:', body);
            next();
        });
    };
};

post.supplement = function () {
    return function (req, res, next) {
        res.status(200).send(req.daouResponse);
    };
};

module.exports = post;
