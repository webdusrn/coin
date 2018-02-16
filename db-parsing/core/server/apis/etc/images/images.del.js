var del = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var path = require('path');

del.validate = function () {
    return function (req, res, next) {
        var FILE = req.meta.std.file;
        req.check('folder', '400_3').isEnum(FILE.enumImageFolders);
        req.utils.common.checkError(req, res, next);
    };
};

del.getImages = function () {
    return function (req, res, next) {
        req.idArray = [];
        req.utils.common.toArray(req.body, 'imageIds');
        for (var i = 0; i < req.body.imageIds.length; i++) {
            req.idArray.push(parseInt(req.body.imageIds[i]));
        }
        req.models.Image.findImagesByIds(req.idArray, req.user, function (status, data) {
            if (status == 200) {
                req.images = data;
                next();
            } else {
                res.hjson(req, next, status, data);
            }
        });
    }
};

del.checkSession = function () {
    return function (req, res, next) {
        if (req.idArray.length == req.images.length) {
            next();
        }
        else {
            return res.hjson(req, next, 403);
        }
    };
};

del.setParam = function () {
    return function (req, res, next) {
        var FILE = req.meta.std.file;

        req.coreUtils.file.setRemoveFiles(req, req.images, FILE.folderImages, FILE.enumPrefixes);
        next();
    };
};

del.destroy = function () {
    return function (req, res, next) {
        req.models.Image.deleteImagesByIds(req.idArray, function (status, data) {
            if (status == 204) {
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    }
};

del.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 204);
    };
};

module.exports = del;
