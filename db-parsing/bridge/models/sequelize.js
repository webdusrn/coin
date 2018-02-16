var utils = require('../utils');
var sequelize = require('../../core/server/config/sequelize');
sequelize.defineAll(utils.mixModelFromPath(
    __dirname,
    '../../core/server/models/sequelize',
    '../../app/server/models/sequelize'
));
module.exports = sequelize.models;