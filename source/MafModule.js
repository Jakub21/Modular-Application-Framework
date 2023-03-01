
class MafModule {
  constructor(app, name) {
    this.app = app;
    this._name = name;
    this._log = this.app.logger.context(this, this._name);
    this.log = (...message) => {}; // function created by the logger
    this._config = this.app.config.subnest(this._log.issuer);
  }
  acknowledge(other) {
    // this method can be used for integration between modules
    // when other is loaded, this can take some action
  }
  onAcknowledged(by) {
    // can be called by a module that acknowledges this one
    // (passes itself as "by")
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
