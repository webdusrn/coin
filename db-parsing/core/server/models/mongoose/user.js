var mongoose = require('mongoose'),
    crypto = require('crypto'),
    Schema = mongoose.Schema;

var mongooseMethodHelper = require('mongoose-method-helper');
const META = require('.././metadata/index');
const USER = META.std.user;

var UserSchema = new Schema({
    'email': {
        type: String,
        unique: true,
        sparse: true
    },
    'pass': {
        type: String
    },
    'p': {
        'num': {
            'type': String,
            unique: true,
            sparse: true
        },
        'token': {
            'type': String
        },
        'type': {
            'type': String,
            'enum': USER.enumPhones,
            'lowercase': true
        }
    },
    'pvdrs': [{
        'type': {
            'type': String,
            'enum': USER.enumProviders,
            'lowercase': true
        },
        'id': {
            'type': String,
            unique: true,
            sparse: true
        },
        'token': {
            'type': String
        },
        'data': {
            'type': Schema.Types.Mixed
        }
    }],
    cnst: {
        type: Boolean,
        default: true,
        required: true
    },
    'nick': {
        'type': String,
        'unique': true,
        'required': true
    },
    'salt': {
        'type': String,
        'required': true
    },
    'gender': {
        'type': String,
        'enum': USER.enumGenders,
        'lowercase': true
    },
    'pfimg': {
        'type': String
    },
    'bgimg': {
        'type': String
    },
    'b': {
        'y': {
            'type': Number
        },
        'm': {
            'type': Number
        },
        'd': {
            'type': Number
        }
    },
    'country': {
        'type': String,
        'uppercase': true,
        'required': true
    },
    'lang': {
        'type': String,
        'lowercase': true,
        'required': true
    },
    'uuid': {
        'type': String
    },
    'bPushes': {
        'take': {
            'type': Boolean,
            'default': true,
            'required': true
        }
    },
    'bReview': {
        'type': Boolean,
        'default': false,
        'required': true
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
    'imgUdtAt': {
        'type': Date
    },
    'role': {
        'type': String,
        'enum': USER.enumRoles,
        'lowercase': true,
        'default': USER.roleUserA,
        'required': true
    },
    'bPublic': {
        'type': Boolean,
        'default': true,
        'required': true
    },
    ip: {
        'type': String,
        required: true
    },
    'del': {
        'type': Boolean,
        'default': false,
        'required': true
    }
}, {safe: true});

UserSchema.set('toJSON', {
    getters: true,
    virtuals: true
});

UserSchema.methods.toJSON = function() {
    var obj = this.toObject();
    obj.oid = obj._id;
    delete obj.__v;
    delete obj.salt;
    delete obj._id;
    return obj;
};

UserSchema.virtual('oid').get(function() {
    return this._id.toString();
}).set(function(oid) {
    this._id = oid;
});

UserSchema.pre('create', function(next) {
    if (this.pass && this.email) {
        this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        this.pass = this.hashSecret(this.pass);
    }
    next();
});

UserSchema.statics.findOneByEmail = function(email, callback) {
    this.findOne({
        'email': USER.providerEmail
    }, function(err, user) {
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

UserSchema.statics.findOneByNick = function(nick, callback) {
    this.findOne({
        'nick': new RegExp(nick, 'i')
    }, function(err, user) {
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

UserSchema.statics.findOneByOid = function(oid, callback) {
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

UserSchema.statics.getNormalUserFields = function() {
    return '-pass -salt -uuid -bReview -bPushes -cnst -pvdrs';
};

UserSchema.statics.getSessionUserFields = function() {
    return '-pass -salt -uuid';
};

UserSchema.methods.create = function(callback) {
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

UserSchema.methods.hashSecret = function(secret) {
    return crypto.pbkdf2Sync(secret, this.salt, 10000, 64).toString('base64');
};

UserSchema.methods.authenticate = function(secret) {
    return this.pass == this.hashSecret(secret);
};

UserSchema.methods.toSecureJSON = function() {
    var obj = this.toJSON();
    delete obj.salt;
    delete obj.pass;
    delete obj.uuid;
    delete obj.bReview;
    delete obj.bPushes;
    delete obj.cnst;
    delete obj.pvdrs;
    delete obj.__v;
    return obj;
};

UserSchema.methods.toSessionJSON = function() {
    var obj = this.toJSON();
    delete obj.salt;
    delete obj.pass;
    delete obj.uuid;
    delete obj.__v;
    for (var i = 0; i < obj.pvdrs.length; ++i) {
        delete obj.pvdrs[i].token;
    }
    return obj;
};

mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');