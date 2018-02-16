var post = {};
var path = require('path');
var fs = require('fs');

var Logger = require('sg-logger');
var logger = new Logger(__filename);

post.validate = function () {
    return function (req, res, next) {
        req.check('folder', '400_3').isEnum(req.meta.std.file.enumFolders);
        req.utils.common.checkError(req, res, next);
    };
};

post.supplement = function () {
    return function (req, res, next) {

        var ret = {
            rows: req.fileNames,
            count: req.fileNames.length
        };

        res.hjson(req, next, 201, ret);
    };
};

module.exports = post;
