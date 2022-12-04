const { Router } = require('express');
const Cookies = require('./Cookies');
const {BuiltinModule} = require("../../MafModule");

module.exports = class CookiesModule extends BuiltinModule {
  constructor(app, prefix) {
    super(app, 'cookies', 'builtin');
    this.EXPRESS_ROUTER = true;
    this.router = Router();
    this.router.all('*', (req, resp, next) => {
      req.cookies = new Cookies(req, prefix);
      next();
    });
  }
}
