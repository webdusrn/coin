var path = require('path');
var routeHelper = require('sg-route-helper');
var express = require('express');

var META = require('../../bridge/metadata');

module.exports = function(app) {
    function renderer () {
        return function (req, res, next) {
            if (req.url === '/oauth/facebook') {
                return next();
            }

            req.preparedParam.params.oauth = {};

            if (META.std.flag.isMoreSocialInfo == true) {
                req.preparedParam.params.oauth.facebook = req.flash('facebook')[0];
                req.preparedParam.params.oauth.twitter = req.flash('twitter')[0];
                req.preparedParam.params.oauth.google = req.flash('google')[0];
            }

            req.models.DomainRender.findRender(req.get('host'), function (status, data) {
                if (status == 200) {

                    if (req.isOldBrowser) {
                        res.render('old-browser', req.preparedParam);
                    } else {
                        res.render(data + '-' + process.env.NODE_ENV, req.preparedParam);
                    }

                } else {
                    res.render('not-found', req.preparedParam);
                }
            });
        }
    }

    app.get('/', routeHelper.prepareParam(), renderer());
    app.get('/*', routeHelper.prepareParam(), renderer());
};