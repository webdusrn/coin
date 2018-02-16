var META = require('../../../bridge/metadata');
var appUtils = require('../utils');

module.exports = function (callback) {
    appUtils.initialization.run(function (status) {
        if (status == 204) {
            console.log("app initialization success");
            callback();
        } else {
            console.log("app initialization fail");
        }
    });
};