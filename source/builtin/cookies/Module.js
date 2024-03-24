import { Router } from 'express';

import { BuiltinModule } from "../../core/MafModule.js";
import Event from "../../core/Event.js";
import Cookies from './Cookies.js';

export default class CookiesModule extends BuiltinModule {
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
