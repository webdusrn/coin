var UAParser = require('ua-parser-js');
var ENV = require('../../../bridge/config/env');

module.exports = function () {
    return function (req, res, next) {

        if (ENV.flag.isUseBrowserCount) {
            var parser = new UAParser();
            var ua = req.headers['user-agent'];
            var browser = parser.setUA(ua).getBrowser();
            var device = parser.setUA(ua).getDevice();
            var engine = parser.setUA(ua).getEngine();
            var os = parser.setUA(ua).getOS();

            req.models.BrowserCount.upsertBrowserCount({
                domain: req.get('host'),
                ip: req.refinedIP,
                browser: browser.name,
                version: browser.major,
                deviceModel: device.model,
                deviceType: device.type,
                deviceVendor: device.vendor,
                engineName: engine.name,
                engineVersion: engine.version,
                osName: os.name,
                osVersion: os.version,
                userAgent: ua
            }, function (status, data) {
                if (status == 204) {

                } else {
                    console.log('BrowserCount fail: ' + req.refinedIP);
                }
            });
        }

        next();
    }
};