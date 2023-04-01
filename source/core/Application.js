const path = require('path');
const Logger = require('./logging/Logger');

module.exports = class Application {
  constructor(config) {
    this.config = config;
    this._setDefaults()
    this.logger = new Logger(this);
    this._log = this.logger.context(this, 'MAF');
    this.log = (...message) => {}; // function created by the logger
    this.loaded = [];
  }

  module(filepath, ...args) {
    this.log(`Loading a module from '${filepath}'`);
    return this._load(path.dirname(require.main.filename), filepath, ...args);
  }
  builtin(name, ...args) {
    this.log(`Loading builtin module '${name}'`);
    return this._load(__dirname, `builtin/${name}/Module.js`, ...args);
  }
  _load(root, filepath, ...args) {
    filepath = path.resolve(root, filepath);
    const Module = require(filepath);
    let instance = new Module(this, ...args);
    this.loaded.map(m=>{m.acknowledge(instance)});
    this.loaded.push(instance);
    return instance;
  }
  _setDefaults() {
    let filepath = '../default.yml';
    filepath = path.resolve(__dirname, filepath);
    this.config.underLoadFile(filepath);
  }
}
