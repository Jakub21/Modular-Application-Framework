import { BuiltinModule } from "../../core/MafModule.js";
import { Server as SocketIO } from "socket.io";
import http from 'http';

export default class SocketServer extends BuiltinModule {
  constructor(app, express) {
    super(app, 'socket', 'builtin');
    this._onConnection = [];
    this._nodes = {};
    this.io = new SocketIO(express._server);
    this.io.on('connection', socket => {
      this._setupNewSocket(socket);
    });
    this.addHandler('SocketNode', event => {
      this.log('Adding socket node', event.data.route);
      if (event.data.route == 'connection') {
        this._onConnection.push(event.data.callback);
        return;
      }
      if (this._nodes[event.data.route] == undefined) this._nodes[event.data.route] = [];
      this._nodes[event.data.route].push(event.data.callback);
    });
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
