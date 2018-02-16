var async = require('async');
var MiddlewareBinder = function(io, socket, payload) {

    var funcs = [];

    this.add = function(func) {
        funcs.push(function (n) {
            func(io, socket, payload, n);
        });
    };

    this.bind = function() {
        async.waterfall(funcs, function(err, io, socket, payload, n) {
            if (err) {
                return socket.emit('req_error', {
                    code: err.code
                });
            }
        });
    };
};

module.exports = MiddlewareBinder;