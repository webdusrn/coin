var routeHelper = require('sg-route-helper');
var express = require('express');

var META = require('../../bridge/metadata');
var isMaintenance = require('../../bridge/config/env').flag.isMaintenance;

module.exports = function (app) {

    function sampleRenderer() {
        return function (req, res, next) {
            if (isMaintenance) {
                req.models.Maintenance.findMaintenanceByDomain(req.get('host'), function (status, data) {
                    if (status == 200) {
                        req.preparedParam.params.maintenance = data;
                    } else {
                        req.preparedParam.params.maintenance = {};
                    }
                    res.render('maintenance', req.preparedParam);
                });
            } else {
                next();
            }
        };
    }

    app.get('/*',
        routeHelper.prepareParam("maintenance"),
        sampleRenderer()
    );

    app.get('/',
        routeHelper.prepareParam("maintenance"),
        sampleRenderer()
    );
};