const {BuiltinModule} = require("../../MafModule");
const { Server:SocketIO } = require("socket.io");
const http = require('http');

module.exports = class SocketServer extends BuiltinModule {
  constructor(app, express) {
    super(app, 'socket', 'builtin');
    this._onConnection = [];
    this._nodes = {};
    this.io = new SocketIO(express._server);
    this.io.on('connection', socket => {
      this._setupNewSocket(socket);
    });
  }
  acknowledge(other) {
    if (!other.SOCKET_NODES) return;
    this.log(`Using nodes from module ${other._name}`);
    for (let [route, callback] of Object.entries(other.nodes)) {
      if (route == 'connection') {
        this._onConnection.push(callback);
        continue;
      }
      if (this._nodes[route] == undefined) this._nodes[route] = [];
      this._nodes[route].push(callback);
    }
    other.onAcknowledged(this);
  }
  _setupNewSocket(socket) {
    this._onConnection.map(cb=>{cb(socket)});
    for (let [route, callbacks] of Object.entries(this._nodes)) {
      for (let cb of callbacks) {
        socket.on(route, (data)=>{cb(socket, data)});
      }
    }
  }
}
