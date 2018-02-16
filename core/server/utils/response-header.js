var CONFIG = require('../../../bridge/config/env');
var apiTesterExp = new RegExp('/' + CONFIG.app.apiName + '/tester');
var apiExp = new RegExp('/' + CONFIG.app.apiName + '/');
var htmlExp = new RegExp('.html');
var isMaintenance = CONFIG.flag.isMaintenance;

module.exports = {
    apiConnect: function () {
        return function (req, res, next) {
            if (!apiTesterExp.test(req.url) && (apiExp.test(req.url) || apiExp.test(req.originalUrl))) {
                if (isMaintenance) {
                    req.models.Maintenance.findMaintenanceByDomain(req.get('host'), function (status, data) {
                        var maintenance = {};
                        if (status == 200) {
                            maintenance = data;
                        }
                        return res.hjson(req, next, 503, maintenance);
                    });
                } else {
                    res.set('cache-control', 'no-cache, no-store, must-revalidate');
                    res.set('pragma',  'no-cache');
                    res.set('expires', 0);
                    next();
                }
            } else {
                next();
            }
        };
    },
    htmlConnect: function () {
        return function (req, res, next) {
            if (htmlExp.test(req.url) ||
                htmlExp.test(req.originalUrl)) {
                res.set('cache-control', 'no-cache, no-store, must-revalidate');
                res.set('pragma',  'no-cache');
                res.set('expires', 0);
            }
            next();
        }
    }
};
