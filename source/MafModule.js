
module.exports = class MafModule {
  constructor(app, name, scope='') {
    this.app = app;
    this._name = name;
    this._fullName = scope?
      [scope, name].join('.').replaceAll('..','.') : name;
    this._config = this.app.config.subnest(this._fullName);
    this._log = this.app.logger.context(this._fullName);
    this.log = (...p) => {this._log.entry(...p)};
  }
  acknowledge(other) {
    // this method can be used for integration between modules
    // when other is loaded, this can take some action
  }
}
