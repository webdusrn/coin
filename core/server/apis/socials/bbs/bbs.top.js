var top = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

top.hasAuthorization = function() {
    return function (req, res, next) {
        req.models.Article.findDataByAuthenticatedId(req.params.id, 'authorId', req.user.id, function(status, data) {
            req.article = data;
            if (status == 200 || (status == 403 && req.user.role >= req.meta.std.user.roleAdmin)) {
                next();
            }
            else {
                res.hjson(req, next, status, data);
            }
        });
    };
};

module.exports = top;
