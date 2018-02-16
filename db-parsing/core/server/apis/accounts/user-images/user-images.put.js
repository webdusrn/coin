var put = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

put.validate = function () {
    return function (req, res, next) {

        var USER = req.meta.std.user;
        var MAGIC = req.meta.std.magic;

        if (req.body.imageIds !== MAGIC.reset) {
            req.check('imageIds', '400_12').isNumberIds(USER.maxImageCount);
        }
        if (req.body.imageIdsToBeDeleted !== undefined) req.check('imageIdsToBeDeleted', '400_12').isNumberIds(USER.maxImageCount);

        req.utils.common.checkError(req, res, next);

    };
};

put.update = function () {
    return function (req, res, next) {
        var MAGIC = req.meta.std.magic;
        var update = {};

        update.userId = req.user.id;
        update.imageIds = req.body.imageIds;

        for (var k in update) {
            if (update[k] == MAGIC.reset) {
                update[k] = null;
            }
        }
        req.models.UserImage.updateUserImages(update, function (status, data) {
            if (status == 200) {
                next();
            } else {
                res.hjson(req, next, status, data);
            }
        });
    };
};

/**
 put.findImagesToBeDeleted = function () {
    return function (req, res, next) {
        var FILE = req.meta.std.file;

        if (req.body.imageIdsToBeDeleted !== undefined) {
            var imageIdsToBeDeleted = req.body.imageIdsToBeDeleted.split(',');

            req.models.Image.findImagesByIds(imageIdsToBeDeleted, req.user, function (status, data) {
                if (status == 200) {

                    req.coreUtils.file.setRemoveFiles(req, data, FILE.folderImages, FILE.enumPrefixes);
                }
                //왜 에러 리턴 안하지?
                next();
            });
        } else {
            next();
        }
    };
};
 **/

put.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 204);
    };
};

module.exports = put;