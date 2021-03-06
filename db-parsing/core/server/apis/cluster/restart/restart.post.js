var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var cluster = require('../../../config/cluster');

post.validate = function () {
    return function (req, res, next) {
        var APP = req.meta.std.app;
        if (req.body.key !== APP.clusterRestartKey) {
            return res.hjson(req, next, 403);
        }
        req.utils.common.checkError(req, res, next);
    };
};

post.restartCluster = function () {
    return function (req, res, next) {
        setTimeout(cluster.restartCluster, req.meta.std.cluster.defaultExecutionDelay);
        next();
    };
};

post.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 204);
    };
};

module.exports = post;
