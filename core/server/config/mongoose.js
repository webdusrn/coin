var config = require('./env/index'),
    mongoose = require('mongoose');

module.exports = function() {

    var db = mongoose.connect(config.db.mongodb);

    require('./mongoose/user');
    require('./mongoose/article');

    return db;
};