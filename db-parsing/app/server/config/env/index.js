var envConfig = require('./' + process.env.NODE_ENV + '.js');
var commonConfig = require('./common.js');

for (var k in commonConfig) {
    var conf = envConfig[k];
    if (conf instanceof String) {
        if (envConfig[k]) {
            commonConfig[k] = envConfig[k];
        }
    } else if (conf instanceof Object) {
        for (var kk in conf) {
            if (conf[kk] !== undefined) {
                commonConfig[k][kk] = conf[kk];
            }
        }
    }
}

module.exports = commonConfig;