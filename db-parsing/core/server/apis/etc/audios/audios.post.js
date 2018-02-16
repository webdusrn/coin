var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

post.validate = function () {
    return function (req, res, next) {
        
        req.check('folder', '400_3').isEnum(req.meta.std.file.enumAudioFolders);

        if (req.body.offsetX !== undefined) {
            req.check('offsetX', '400_5').isInt();
        } else {
            req.body.offsetX = 0;
        }

        if (req.body.offsetY !== undefined) {
            req.check('offsetY', '400_5').isInt();
        } else {
            req.body.offsetY = 0;
        }

        if (req.body.width !== undefined) {
            req.check('width', '400_5').isInt();
        } else {
            req.body.width = 0;
        }

        if (req.body.height !== undefined) {
            req.check('height', '400_5').isInt();
        } else {
            req.body.height = 0;
        }

        req.utils.common.checkError(req, res, next);
    };
};

post.bulkCreate = function () {
    return function (req, res, next) {
        var audios = [];
        for (var i=0; i<req.fileNames.length; i++) {
            var body = {
                name: req.fileNames[i],
                folder: req.body.folder,
                dateFolder: req.dateFolder,
                authorId: req.user.id
            };
            audios.push(body);
        }
        req.models.Audio.createAudios(audios, function (status, data) {
            if (status == 201) {
                req.audios = data;
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

post.getAudios = function () {
    return function (req, res, next) {
        req.models.Audio.findAudiosByObj(
            req.audios,
            function (status, data) {
                if (status == 200) {
                    req.audios = data;
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
            audios: req.audios
        };

        res.hjson(req, next, 201, ret);
    };
};

module.exports = post;
