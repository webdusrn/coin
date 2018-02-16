var fs = require('fs');
var path = require('path');

var utils = require('../utils');
var coreEnv = require('../../core/server/config/env');

if (fs.existsSync(path.resolve(__dirname, '../../app/server/config/env'))) {
    var appEnv = require('../../app/server/config/env');
    // appEnv가 우선순위가 더 높다.
    module.exports = utils.mix(coreEnv, appEnv);
} else {
    module.exports = coreEnv;
}