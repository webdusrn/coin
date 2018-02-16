var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

post.validate = function () {
    return function (req, res, next) {
        var NOTICE = req.meta.std.notice;

        req.check('title', '400_8').len(NOTICE.minTitleLength, NOTICE.maxTitleLength);
        req.check('body', '400_8').len(NOTICE.minBodyLength, NOTICE.maxBodyLength);
        req.check('type', '400_3').isEnum(NOTICE.enumNoticeTypes);
        if (req.body.country !== undefined) {
            var enumData = req.coreUtils.common.getCountryEnum(req);
            req.check('country', '400_3').isEnum(enumData);
        }

        if (req.body.startDate !== undefined) req.check('startDate', '400_18').isMicroTimestamp();
        if (req.body.endDate !== undefined) req.check('endDate', '400_18').isMicroTimestamp();
        if (req.body.thumbnailImageId !== undefined) req.check('thumbnailImageId', '400_12').isInt();
        if (req.body.bigImageId !== undefined) req.check('bigImageId', '400_12').isInt();
        if (req.body.smallImageId !== undefined) req.check('smallImageId', '400_12').isInt();
        
        req.utils.common.checkError(req, res, next);
    };
};

post.setParam = function () {
    return function (req, res, next) {
        var body = req.body;
        var instance = req.models.Notice.build(body);
        instance.create(function (status, data) {
            if (status == 200) {
                req.instance = data;
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

post.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.instance);
    };
};

module.exports = post;