var del = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

del.logout = function(){
    return function(req, res, next){
        req.coreUtils.session.logout(req, function(status, data) {
            if (status == 204) {
                return res.hjson(req, next, 204);
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

module.exports = del;
