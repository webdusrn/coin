var gets = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var MICRO = require('microtime-nodejs');

gets.validate = function(){
    return function(req, res, next){
        if (req.query.last === undefined) req.query.last = req.query.last = MICRO.now();
        if (req.query.size === undefined) req.query.size = req.meta.std.common.defaultLoadingLength;
        req.check('last', '400_18').isMicroTimestamp();
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
        req.extinctUsers = [];
        req.models.ExtinctUser.findAllExtinctUsers(size, last, function(status, data) {
            for (var i = 0; i < data.length; ++i) {
                req.extinctUsers.push(JSON.parse(data[i].data));
            }
            next();
        });
    };
};

gets.supplement = function(){
    return function(req, res, next){
        var ret = {
            rows: req.extinctUsers
        };
        res.hjson(req, next, 200, ret);
    };
};

module.exports = gets;
