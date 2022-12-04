const fs = require('fs');
const {Router} = require('express');
const webUtils = require('@jakub21/webutils');

const {BuiltinModule} = require("../../MafModule");

module.exports = class WebUtilsServer extends BuiltinModule {
  constructor(app, route='/lib/webUtils') {
    super(app, 'webUtils', 'builtin');
    this.EXPRESS_ROUTER = true;
    this.router = new Router();
    this.router.get(route, (req, resp) => {
      fs.readFile(webUtils.path, 'utf-8', (err, data) => {
        if (err) { resp.status(404).end(); return; }
        resp.header('Content-Type', 'text/javascript');
        resp.write(data);
        resp.status(200).end();
      });
    });
  }
}
