var META = require('../../../bridge/metadata/index');
var CODES = META.codes;

/**
 * 정의한 기능만 사용하기 위한 세팅
 */

function SocketUtil(io, socket) {
    this.io = io;
    this.socket = socket;
}

SocketUtil.prototype.joinRoom = function (roomId, data) {
    this.socket.join(roomId);
    this.io.to(roomId).emit('join user', data);
};

SocketUtil.prototype.leaveRoom = function (roomId) {
    this.socket.leave(roomId);
    this.socket.broadcast.to(roomId).emit('leave user', this.socket.id, this.socket.adapter.rooms[roomId]);
};

SocketUtil.prototype.sendMessage = function (roomId, data) {
    this.io.to(roomId).emit('chat message', data);
};

SocketUtil.prototype.isTyping = function (roomId, userId, isTyping) {
    this.io.to(roomId).emit("isTyping", {userId: userId, isTyping: isTyping});
};

module.exports = SocketUtil;