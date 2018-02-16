var post = {};
var path = require('path');
var fs = require('fs');

var Logger = require('sg-logger');
var logger = new Logger(__filename);

post.validate = function () {
    return function (req, res, next) {
        var FILE = req.meta.std.file;
        req.body.folder = FILE.folderCk;

        req.utils.common.checkError(req, res, next);
    };
};

post.create = function () {
    return function (req, res, next) {
        var body;

        for (var i = 0; i < req.fileNames.length; i++) {
            body = {
                name: req.fileNames[i],
                folder: req.body.folder,
                dateFolder: req.dateFolder,
                authorId: req.user.id
            };
        }

        var instance = req.models.Image.build(body);
        instance.create(function (status, data) {
            if (status == 200) {
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

post.supplement = function () {
    return function (req, res, next) {

        var META = req.meta;
        var STD = META.std;
        var CDN = STD.cdn;
        var FILE = STD.file;

        var lang = req.query.langCode;
        var langs = META.langs[lang];
        if (!langs) {
            langs = META.langs[META.local.defaultLanguage];
        }

        var msg = langs.uploadSuccess;
        var funcId = req.query.CKEditorFuncNum;

        var url = CDN.rootUrl;
        if (url && url[url.length - 1] == '/') {
            url = url.substr(0, url.length - 1);
        }

        url += "/" + FILE.folderImages + "/" + FILE.folderCk + "/" + req.dateFolder + "/" + req.fileNames[0];

        res.send("<script type='text/javascript'>window.parent.CKEDITOR.tools.callFunction('" + funcId + "', '" + url + "', '" + msg + "')</script>");
    };
};

module.exports = post;
