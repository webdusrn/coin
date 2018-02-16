var utils = require('../utils');
module.exports = utils.mixFromPath(
    __dirname,
    '../../core/server/metadata/standards-local.js',
    '../../app/server/metadata/standards-local.js'
);