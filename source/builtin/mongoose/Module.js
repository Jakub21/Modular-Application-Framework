import { config } from 'dotenv';
import { connect as _connect, Schema, model as _model } from 'mongoose';

import { BuiltinModule } from "../../core/MafModule.js";
import Event from "../../core/Event.js";
import { strFormat, inputPassword } from '../../util.js';

export default class Mongoose extends BuiltinModule {
  constructor(app) {
    super(app, 'mongoose');
    this.models = {};
    this.addHandler('MongooseSchema', event => {
      this.log(`Using schema from ${event.emitter._name}`);
      this.addSchema(event.data.schemaName, event.data.schema);
    });
    this.addHandler('AppStart', event => {
      this.emit(new Event('MongooseStart', {models: this.models}));
    });
  }
  async connect() {
    this.log('Connecting...');
    let options = this._config.subnest('connectOptions').toObject();
    this.connection = await _connect(this.generateURI(), options);
    this.log('Connected');
  }
  addSchema(name, data) {
    let schema = new Schema(data);
    this.log('Adding schema', name);
    let model = _model(name, schema);
    this.models[name] = model;
  }
  generateURI() {
    let URI = this._config.get('URI');
    let password;
    let passwordMode = this._config.get('password');
    if (passwordMode == 'terminal') password = inputPassword('Database password:');
    else if (passwordMode == 'env') password = this.app.config.get('env.mongoosePassword');
    else throw 'Config has invalid value of builtin.mongoose.password';
    return strFormat(URI, {password});
  }
  getTypes() {
    return Schema.Types;
  }
}
