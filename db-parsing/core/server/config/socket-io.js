var STD = require('../../../bridge/metadata/standards');

var CONFIG = require('../../../bridge/config/env');
var chat = require('../chat');
var chatNoSession = require('../chat/no-session');

var sessionMiddleware = require('../config/express').sessionMiddleware;

module.exports = function (server, app) {

    var io;

    if (CONFIG.flag.isUseChat) {
        // var http = require('http').Server(app);
        io = require('socket.io')(server.http);

        io.use(function (socket, next) {
            sessionMiddleware(socket.request, socket.request.res, next);
        });
        app.use(sessionMiddleware);

        chat.init(io);
        chatNoSession.init(io);
    }

    return server;
};