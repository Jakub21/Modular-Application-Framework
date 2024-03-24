import { readFile } from 'fs';
import { Router } from 'express';
import { path } from '@jakub21/webutils';

import { BuiltinModule } from "../../core/MafModule.js";
import Event from "../../core/Event.js";

export default class WebUtilsServer extends BuiltinModule {
  constructor(app, route='/lib/webUtils') {
    super(app, 'webUtils', 'builtin');
    this.router = new Router();
    this.router.get(route, (req, resp) => {
      readFile(path, 'utf-8', (err, data) => {
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
