
class MafModule {
  constructor(app, name) {
    this.app = app;
    this._name = name;
    this._handlers = {};
    this.log = (...message) => {}; // function created by the logger
    this._log = this.app.logger.context(this, this._name);
    this._config = this.app.config.subnest(this._log.issuer);
  }
  emit(event) {
    event.assign(this);
    this.app.register(event);
  }
  addHandler(key, callback) {
    this._handlers[key] = callback;
  }
  handle(event) {
    if (!Object.keys(this._handlers).includes(event.key)) return;
    this._handlers[event.key](event);
  }
}

class BuiltinModule extends MafModule {
  constructor(app, name) {
    super(app, name);
    this._log = this.app._log.context(this, this._name);
    this._config = this.app.config.subnest(`builtin.${this._name}`);
  }
}

module.exports = {MafModule, BuiltinModule};
