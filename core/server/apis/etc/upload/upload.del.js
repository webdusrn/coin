var del = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var path = require('path');

del.checkSession = function() {
    return function(req, res, next) {
        if (req.user.role >= req.meta.std.user.roleAdmin) { // check admin session
            next();
        }
    }
};

del.validate = function(){
    return function(req, res, next){
        var FILE = req.meta.std.file;
        var filePath = path.join(__dirname, "../../../../.." + req.meta.std.cdn.rootUrl + '/' + req.body.folder + '/');

        req.files = [];

        for (var i=0; i<FILE.enumPrefixes.length; i++) {
            req.files.push({
                path: filePath + FILE.enumPrefixes[i] + req.body.file
            });
        }
        req.files.push({
            path: filePath + req.body.file
        });

        req.check('folder','400_3').isEnum(FILE.enumFolders);
        req.utils.common.checkError(req, res, next);
    };
};

del.supplement = function(){
    return function(req, res, next){
        res.hjson(req, next, 204);
    };
};

module.exports = del;
