var express = require('express');
var utils = require('../utils/index');
var middleWare = require('../middles');
var UAParser = require('ua-parser-js');
var fs = require('fs');
var path = require('path');

module.exports = function (app) {
    app.use(middleWare.connect());

    app.use(function (req, res, next) {
        req.appUtils = require('../utils');
        next();
    });

    app.use(function (req, res, next) {
        var ua = req.headers['user-agent'];

        if (typeof ua == 'string') {
            var isMobile = {
                Android: function () {
                    return ua.match(/Android/i);
                },
                BlackBerry: function () {
                    return ua.match(/BlackBerry/i);
                },
                iOS: function () {
                    return ua.match(/iPhone|iPad|iPod/i);
                },
                Opera: function () {
                    return ua.match(/Opera Mini/i);
                },
                Windows: function () {
                    return ua.match(/IEMobile/i) || ua.match(/WPDesktop/i);
                },
                any: function () {
                    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
                }
            };

            req.isMobile = isMobile.any();

            var parser = new UAParser();
            var result = parser.setUA(ua).getResult();

            if (result.browser.name == 'IE' && parseInt(result.browser.major) < 10) {
                console.log(result.browser);
                req.isOldBrowser = true;
            }
        }

        next();
    });

    utils.scheduler.run();
};