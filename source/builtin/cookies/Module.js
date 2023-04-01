const { Router } = require('express');

const {BuiltinModule} = require("../../core/MafModule");
const Event = require("../../core/Event");
const Cookies = require('./Cookies');

module.exports = class CookiesModule extends BuiltinModule {
  constructor(app, prefix) {
    super(app, 'cookies', 'builtin');
    this.router = Router();
    this.router.all('*', (req, resp, next) => {
      req.cookies = new Cookies(req, prefix);
      next();
    });
    this.emit(new Event('ExpressRouter', {
      routeName: '',
      router: this.router,
    }));
  }
}
