import { BuiltinModule } from "../../core/MafModule.js";
import * as exp from 'express';
import express from 'express';

const MIDDLEWARE = {
  json: exp.json,
  raw: exp.raw,
  text: exp.text,
  urlencoded: exp.urlencoded,
  static: (params) => {
    let root = params.root;
    delete params.root;
    return exp.static(root, params);
  },
};

export default class ExpressServer extends BuiltinModule {
  constructor(app) {
    super(app, 'express', 'builtin');
    let port = this._config.get('port');
    this.log(`Listening on port ${port}`);
    this.express = express();
    this._server = this.express.listen(port);
    this._setupMiddleware();
    this.addHandler('ExpressRouter', event => {
      this.log(`Using router from ${event.emitter._name}`);
      this.express.use(event.data.routeName, event.data.router);
    });
  }
  _setupMiddleware() {
    for (let [key, mw] of Object.entries(MIDDLEWARE)) {
      let enabled = this._config.get(key);
      if (enabled) {
        this.log(`Using builtin middleware '${key}'`);
        let params = this._config.getScope(`${key}.params`) || {};
        this.express.use(mw(params));
      }
    }
  }
}
