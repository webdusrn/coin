var del = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

del.validate = function(){
    return function(req, res, next){

        req.utils.common.toArray(req.body, 'files');

        req.check('folder','400_3').isEnum(req.meta.std.file.enumFolders);
        req.utils.common.checkError(req, res, next);
    };
};

del.supplement = function(){
    return function(req, res, next){
        res.hjson(req, next, 204);
    };
};

module.exports = del;
