var fs = require('fs');
var path = require('path');

var utils = require('../utils');
var coreStd = require('../../core/server/metadata/standards');

if (fs.existsSync(path.resolve(__dirname, '../../app/server/metadata/standards'))) {
    var appStd = require('../../app/server/metadata/standards');
    module.exports = utils.mix(coreStd, appStd);
} else {
    module.exports = coreStd;
}