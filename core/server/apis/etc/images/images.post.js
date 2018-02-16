var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

post.validate = function () {
    return function (req, res, next) {
        
        req.check('folder', '400_3').isEnum(req.meta.std.file.enumImageFolders);

        if (req.body.offsetX !== undefined) {
            req.check('offsetX', '400_5').isInt();
        }

        if (req.body.offsetY !== undefined) {
            req.check('offsetY', '400_5').isInt();
        }

        if (req.body.width !== undefined) {
            req.check('width', '400_5').isInt();
        }

        if (req.body.height !== undefined) {
            req.check('height', '400_5').isInt();
        }

        req.utils.common.checkError(req, res, next);
    };
};

post.bulkCreate = function () {
    return function (req, res, next) {
        var images = [];
        for (var i=0; i<req.fileNames.length; i++) {
            var body = {
                name: req.fileNames[i],
                folder: req.body.folder,
                dateFolder: req.dateFolder,
                authorId: req.user.id
            };
            images.push(body);
        }
        req.models.Image.createImages(images, function (status, data) {
            if (status == 201) {
                req.images = data;
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

post.getImages = function () {
    return function (req, res, next) {
        req.models.Image.findImagesByObj(
            req.images,
            function (status, data) {
                if (status == 200) {
                    req.images = data;
                    next();
                } else {
                    res.hjson(req, next, status, data);
                }
            }
        );
    };
};

post.supplement = function () {
    return function (req, res, next) {
        var ret = {
            rows: req.fileNames,
            count: req.fileNames.length,
            images: req.images
        };

        res.hjson(req, next, 201, ret);
    };
};

module.exports = post;
