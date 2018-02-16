var put = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

put.validate = function () {
    return function (req, res, next) {
        var NOTICE = req.meta.std.notice;
        if (req.body.title !== undefined) req.check('title', '400_8').len(NOTICE.minTitleLength, NOTICE.maxTitleLength);
        if (req.body.body !== undefined) req.check('body', '400_8').len(NOTICE.minBodyLength, NOTICE.maxBodyLength);
        if (req.body.type !== undefined) req.check('type', '400_28').isEnum(NOTICE.enumNoticeTypes);
        if (req.body.country !== undefined) {
            req.check('country', '400_3').isEnum(req.coreUtils.common.getCountryEnum(req));
        }

        if (req.body.startDate !== undefined) req.check('startDate', '400_18').isMicroTimestamp();
        if (req.body.endDate !== undefined) req.check('endDate', '400_18').isMicroTimestamp();
        if (req.body.thumbnailImageId !== undefined) req.check('thumbnailImageId', '400_12').isInt();
        if (req.body.bigImageId !== undefined) req.check('bigImageId', '400_12').isInt();
        if (req.body.smallImageId !== undefined) req.check('smallImageId', '400_12').isInt();

        req.utils.common.checkError(req, res, next);
    };
};

put.update = function () {
    return function (req, res, next) {
        var update = req.body;
        req.models.Notice.updateDataByIdAndReturnData(req.params.id, update, function (status, data) {
            if (status == 200) {
                req.report = data;
                next();
            } else {
                res.hjson(req, next, status, data);
            }
        });
    };
};

put.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.report);
    };
};

module.exports = put;
