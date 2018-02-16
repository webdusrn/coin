var gets = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var skins = require('./skins.js');

gets.validate = function () {
    return function (req, res, next) {
        next();
    };
};

gets.setParam = function () {
    return function (req, res, next) {
        skins.loadSkinNames(function (result, skins) {

            req.data = skins;
            next();
        });
    };
};

gets.supplement = function () {
    return function (req, res, next) {
        var ret = {
            rows: req.data
        };
        res.hjson(req, next, 200, req.data);
    };
};

module.exports = gets;