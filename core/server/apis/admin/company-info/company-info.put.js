var put = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

put.validate = function () {
    return function (req, res, next) {
        var COMPANY_INFO = req.meta.std.companyInfo;

        req.check('companyName', '400_8').len(COMPANY_INFO.minCompanyNameLength, COMPANY_INFO.maxCompanyNameLength);
        req.check('representative', '400_8').len(COMPANY_INFO.minRepresentativeLength, COMPANY_INFO.maxRepresentativeLength);
        req.check('regNum', '400_8').len(COMPANY_INFO.minRegNumLength, COMPANY_INFO.maxRegNumLength);
        req.check('privateInfoManager', '400_8').len(COMPANY_INFO.minPrivateInfoManagerLength, COMPANY_INFO.maxPrivateInfoManagerLength);
        req.check('address', '400_8').len(COMPANY_INFO.minAddressLength, COMPANY_INFO.maxAddressLength);
        if (req.body.communicationsRetailReport !== undefined) req.check('contact', '400_8').len(COMPANY_INFO.minContactLength, COMPANY_INFO.maxContactLength);
        if (req.body.contact !== undefined) req.check('contact', '400_8').len(COMPANY_INFO.minContactLength, COMPANY_INFO.maxContactLength);
        if (req.body.contact2 !== undefined) req.check('contact', '400_8').len(COMPANY_INFO.minContactLength, COMPANY_INFO.maxContactLength);
        if (req.body.fax !== undefined) req.check('contact', '400_8').len(COMPANY_INFO.minContactLength, COMPANY_INFO.maxContactLength);
        if (req.body.email !== undefined) req.check('email', '400_8').len(COMPANY_INFO.minEmailLength, COMPANY_INFO.maxEmailLength);

        req.utils.common.checkError(req, res, next);
    };
};

put.setParam = function () {
    return function (req, res, next) {
        var MAGIC = req.meta.std.magic;

        var body = {
            id: 1,
            companyName: req.body.companyName,
            representative: req.body.representative,
            regNum: req.body.regNum,
            privateInfoManager: req.body.privateInfoManager,
            address: req.body.address
        };

        if (req.body.communicationsRetailReport !== undefined) {
            if (req.body.communicationsRetailReport == MAGIC.reset) {
                body.communicationsRetailReport = null;
            } else {
                body.communicationsRetailReport = req.body.communicationsRetailReport;
            }
        }

        if (req.body.contact !== undefined) {
            if (req.body.contact == MAGIC.reset) {
                body.contact = null;
            } else {
                body.contact = req.body.contact;
            }
        }

        if (req.body.contact2 !== undefined) {
            if (req.body.contact2 == MAGIC.reset) {
                body.contact2 = null;
            } else {
                body.contact2 = req.body.contact2;
            }
        }

        if (req.body.fax !== undefined) {
            if (req.body.fax == MAGIC.reset) {
                body.fax = null;
            } else {
                body.fax = req.body.fax;
            }
        }

        if (req.body.email !== undefined) {
            if (req.body.email == MAGIC.reset) {
                body.email = null;
            } else {
                body.email = req.body.email;
            }
        }

        req.models.CompanyInfo.upsertData(body, {
            where: {
                id: 1
            }
        }, function (status, data) {

            if (status == 200) {
                req.data = data;
                next();
            } else {
                return res.hjson(req, next, status, data);
            }

        });

    };
};

put.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.data);
    };
};

module.exports = put;