var get = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var packageJSON = require('../../../../../package.json');
var packageAppJSON = require('../../../../../app/package.json');

get.validate = function () {
    return function (req, res, next) {
        if (req.query.type !== undefined) req.check('type', '400_3').isEnum(req.meta.std.metadata.enumMetaTypes);
        req.utils.common.checkError(req, res, next);
    };
};

get.getMobileVersion = function () {
    return function (req, res, next) {
        req.models.MobileVersion.findMobileVersions(function (status, data) {
            if (status == 200) {
                req.mobileVersion = data;

                if (data.android) {
                    res.set('X-SG-Android-Version', req.mobileVersion.android);
                }

                if (data.ios) {
                    res.set('X-SG-Ios-Version', req.mobileVersion.ios);
                }

            }
            next();
        });
    };
};

get.sendMeta = function () {
    return function (req, res, next) {
        res.set('X-SG-Version', packageJSON.version);
        res.set('X-SG-App-Version', packageAppJSON.version);

        var data = req.meta;
        if (req.query.type !== undefined) {
            data = data[req.query.type];
        }

        res.hjson(req, next, 200, data);
    };
};

module.exports = get;
