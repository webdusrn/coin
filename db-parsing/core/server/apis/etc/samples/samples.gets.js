var gets = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

gets.validate = function(){
    return function(req, res, next){
        if (req.query.last === undefined) req.query.last = 0;
        if (req.query.size === undefined) req.query.size = req.meta.std.common.defaultLoadingLength;
        req.check('last', '400_5').isInt();
        req.check('size', '400_5').isInt();
        if (req.query.userId !== undefined) req.check('userId', '400_12').isInt();
        req.utils.common.checkError(req, res, next);
    };
};

gets.setParam = function() {
    return function(req, res, next) {
        var size = req.query.size;
        var last = req.query.last;
        var where = {};
        if (req.query.userId !== undefined) where.userId = req.query.userId;
        req.models.Test.findAllDataForPage(where, size, last, function(status, data) {
            if (status == 200) {
                req.data = data;
                next();
            } else {
                res.hjson(req, next, status, data);
            }
        });
    };
};

gets.supplement = function(){
    return function(req, res, next){
        var ret = {
            rows: req.data
        };
        res.hjson(req, next, 200, req.data);
    };
};

module.exports = gets;
