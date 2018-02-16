var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var mongooseMethodHelper = require('mongoose-method-helper');
const META = require('.././metadata/index');
const ARTICLE = META.std.article;

var ArticleSchema = new Schema({
    'author': {
        'type': Schema.ObjectId,
        'ref': 'User',
        'required': true
    },
    'cts': {
        'type': String,
        'required': true,
        'trim': true
    },
    'slug': {
        'type': String,
        'required': true,
        'unique': true
    },
    'tags': [{
        'type': String,
        'trim': true
    }],
    'pts': [{
        'type': Number
    }],
    'sTags': [{
        'type': String,
        'trim': true
    }],
    'media': [{
        'type': String,
        'trim': true
    }],
    'expls': [{
        'type': String,
        'trim': true
    }],
    'bPublic': {
        'type': Boolean,
        'required': true,
        'default': true
    },
    'ptcts': [{
        'type': Schema.ObjectId,
        'ref': 'User'
    }],
    'grp': {
        'type': Schema.ObjectId,
        'ref': 'Group'
    },
    'bAnnony': {
        'type': Boolean,
        'required': true,
        'default': false
    },
    'crtAt': {
        'type': Date,
        'default': new Date(),
        'required': true
    },
    'udtAt': {
        'type': Date,
        'default': new Date(),
        'required': true
    },
    del: {
        'type': Boolean,
        'default': false,
        'required': true
    },
    ip: {
        'type': String,
        required: true
    }
}, {safe: true});

ArticleSchema.set('toJSON', {
    getters: true,
    virtuals: true
});

ArticleSchema.methods.toJSON = function() {
    var obj = this.toObject();
    obj.oid = obj._id;
    delete obj.__v;
    delete obj._id;
    return obj;
};

ArticleSchema.virtual('oid').get(function() {
    return this._id.toString();
}).set(function(oid) {
    this._id = oid;
});

ArticleSchema.methods.create = function(callback) {
    var self = this;
    this.save(function(err) {
        if (err) {
            return callback(mongooseMethodHelper.errorHandler(err));
        }
        callback({
            status: 201,
            state: mongooseMethodHelper.STATE.SUCCESS,
            data: self
        });
    });
};

ArticleSchema.statics.findOneByOid = function(oid, callback) {
    this.findById(oid, function(err, user) {
        if (err) {
            console.error(err);
            callback({
                status: 400,
                state: mongooseMethodHelper.STATE.FAIL,
                data: err
            });
        } else {
            callback({
                status: 200,
                state: mongooseMethodHelper.STATE.SUCCESS,
                data: user
            });
        }
    });
};

mongoose.model('Article', ArticleSchema);

module.exports = mongoose.model('Article');