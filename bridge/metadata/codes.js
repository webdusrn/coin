var utils = require('../utils');

var serverCodeRootPath = '../../core/server/metadata/codes';
var appCodeRootPath = '../../app/server/metadata/codes';
module.exports = utils.mixFromDir(
    __dirname,
    serverCodeRootPath,
    appCodeRootPath
);