var redisAdapter = require('socket.io-redis');
var url = require('url');
var redis = require('redis');

var CONFIG = require('../../../../bridge/config/env');
var STD = require('../../../../bridge/metadata/standards');

var models = require('../../models/sequelize');
var Binder = require('./binder');
var middles = require('./middlewares');

module.exports.init = function (io) {

    var http = require("http"),
        socketIo = require('socket.io'),
        server = http.createServer(function (req, res) {
        });

    server.listen(STD.chat.noSessionChatPort, null); // HTTP 서버 생성

    io = socketIo.listen(server); // Socket.IO를 HTTP서버에 연결

    // if (CONFIG.flag.isUseRedis) {
    //     var redisAuth = ["", ""];
    //     var redisUrl = url.parse(CONFIG.db.socketRedis);
    //
    //     if (redisUrl.auth) {
    //         redisAuth = redisUrl.auth.split(':');
    //     }
    //
    //     var pub = redis.createClient(redisUrl.port, redisUrl.hostname, {
    //         return_buffers: true,
    //         auth_pass: redisAuth[1]
    //     });
    //
    //     var sub = redis.createClient(redisUrl.port, redisUrl.hostname, {
    //         return_buffers: true,
    //         detect_buffers: true,
    //         auth_pass: redisAuth[1]
    //     });
    //
    //     io.adapter(redisAdapter({pubClient: pub, subClient: sub}));
    // }
    //
    // io.set('authorization', middles.authorization);

    // var roomId = 'main';

    io.on('connection', function (socket) {
        console.log(socket.id + ' Client connected...');

        // socket.join(1);
        socket.emit('connect');

        socket.on(STD.chat.clientSendMessage, function (body) {
            var joinBinder = new Binder(io, socket, body);
            joinBinder.add(middles.validateSendMessage());
            joinBinder.add(middles.sendMessage());
            joinBinder.bind();
        });
        socket.on(STD.chat.clientJoinRoom, function (body) {
            var joinBinder = new Binder(io, socket, body);
            joinBinder.add(middles.validateJoinRoom());
            joinBinder.add(middles.joinRoom());
            joinBinder.bind();
        });

        socket.on(STD.chat.clientLeaveRoom, function (body) {
            var joinBinder = new Binder(io, socket, body);
            joinBinder.add(middles.validateLeaveRoom());
            joinBinder.add(middles.leaveRoom());
            joinBinder.bind();
        });

        // socket.on(STD.chat.clientTyping, function (body) {
        //     if (body && body.roomId) {
        //         var roomId = body.roomId;
        //
        //         body.id = socket.id;
        //         socket.emit(STD.chat.serverTyping, body);
        //         socket.broadcast.to(roomId).emit(STD.chat.serverTyping, body);
        //     } else {
        //         socket.emit(STD.chat.serverRequestFail, 400, {
        //             code: '400_14'
        //         });
        //     }
        // });

        // socket.on(STD.chat.clientRequestJoinRoom, function (body) {
        //     var joinBinder = new Binder(io, socket, body);
        //     joinBinder.add(middles.isLoggedIn());
        //     joinBinder.add(middles.requestJoinRoom());
        //     joinBinder.bind();
        // });
        //
        // socket.on(STD.chat.clientJoinAllRooms, function (body) {
        //     var joinBinder = new Binder(io, socket, body);
        //     joinBinder.add(middles.isLoggedIn());
        //     joinBinder.add(middles.joinAllRoomsFromDB());
        //     joinBinder.bind();
        // });
        //
        // socket.on(STD.chat.clientLeaveRoom, function (body) {
        //     var joinBinder = new Binder(io, socket, body);
        //     joinBinder.add(middles.isLoggedIn());
        //     joinBinder.add(middles.validateLeaveRoom());
        //     joinBinder.add(middles.leaveRoom());
        //     joinBinder.bind();
        // });
        //
        // socket.on(STD.chat.clientTyping, function (body) {
        //     var joinBinder = new Binder(io, socket, body);
        //     joinBinder.add(middles.isLoggedIn());
        //     joinBinder.add(middles.validateTyping());
        //     joinBinder.add(middles.onTyping());
        //     joinBinder.bind();
        // });
        //
        // socket.on(STD.chat.clientSendMessage, function (body) {
        //     var joinBinder = new Binder(io, socket, body);
        //     joinBinder.add(middles.isLoggedIn());
        //     joinBinder.add(middles.validateSendMessage());
        //     joinBinder.add(middles.checkPrivateChatRoomUser());
        //     joinBinder.add(middles.sendMessage());
        //     joinBinder.bind();
        //
        // });
        //
        // socket.on(STD.chat.clientReadMessage, function (body) {
        //     var joinBinder = new Binder(io, socket, body);
        //     joinBinder.add(middles.isLoggedIn());
        //     joinBinder.add(middles.validateReadMessage());
        //     joinBinder.add(middles.readMessage());
        //     joinBinder.bind();
        //
        // });

        socket.on('disconnect', function () {
            console.log('disconnect', socket.id);

            var joinBinder = new Binder(io, socket, {});
            joinBinder.add(middles.disconnect());
            joinBinder.bind();
        });

    });

    function randomString() {
        var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
        var string_length = 10;
        var randomstring = '';
        for (var i = 0; i < string_length; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
            randomstring += chars.substring(rnum, rnum + 1);
        }
        return randomstring;
    }

};