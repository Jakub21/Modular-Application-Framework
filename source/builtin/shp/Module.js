const fs = require('fs');
const {Router} = require('express');
const shp = require('@jakub21/shp');

const {BuiltinModule} = require("../../core/MafModule");

module.exports = class ShpServer extends BuiltinModule {
  constructor(app, route='/lib/shp') {
    super(app, 'shp', 'builtin');
    this.EXPRESS_ROUTER = true;
    this.router = new Router();
    this.router.get(route, (req, resp) => {
      fs.readFile(shp.path, 'utf-8', (err, data) => {
        if (err) { resp.status(404).end(); return; }
        resp.header('Content-Type', 'text/javascript');
        resp.write(data);
        resp.status(200).end();
      });
    });
  }
}
