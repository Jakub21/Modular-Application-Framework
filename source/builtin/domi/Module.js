const fs = require('fs');
const {Router} = require('express');
const domi = require('@jakub21/domi');

const {BuiltinModule} = require("../../core/MafModule");
const Event = require("../../core/Event");

module.exports = class DomiServer extends BuiltinModule {
  constructor(app, route='/lib/domi') {
    super(app, 'domi', 'builtin');
    this.router = new Router();
    this.router.get(route, (req, resp) => {
      fs.readFile(domi.path, 'utf-8', (err, data) => {
        if (err) { resp.status(404).end(); return; }
        resp.header('Content-Type', 'text/javascript');
        resp.write(data);
        resp.status(200).end();
      });
    });
    this.emit(new Event('ExpressRouter', {
      routeName: '',
      router: this.router,
    }));
  }
}
