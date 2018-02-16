var utils = require('../utils');

var serverCodeRootPath = '../../core/server/metadata/languages';
var appCodeRootPath = '../../app/server/metadata/languages';
module.exports = utils.mixFromDir(
    __dirname,
    serverCodeRootPath,
    appCodeRootPath
);