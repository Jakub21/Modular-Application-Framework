const { config } = require('dotenv');
const mongoose = require('mongoose');

const { BuiltinModule } = require("../../core/MafModule");
const { strFormat, inputPassword } = require('../../util');

module.exports = class Mongoose extends BuiltinModule {
  constructor(app) {
    super(app, 'mongoose');
    this.models = {};
    this.addHandler('MongooseSchema', event => {
      this.log(`Using schema from ${event.emitter._name}`);
      this.addSchema(event.data.schemaName, event.data.schema);
    });
  }
  async connect() {
    this.log('Connecting...');
    let options = this._config.subnest('connectOptions').toObject();
    this.connection = await mongoose.connect(this.generateURI(), options);
    this.log('Connected');
  }
  addSchema(name, data) {
    let schema = new mongoose.Schema(data);
    this.log('Adding schema', name);
    let model = mongoose.model(name, schema);
    console.log('model', model);
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
    return mongoose.Schema.Types;
  }
}
