import {createRequire} from 'module';
import { dirname, resolve } from 'path';
import Logger from '../logging/Logger.js';
import Event from './Event.js';


export default class Application {
  constructor(config) {
    // https://github.com/tschaub/es-main/blob/main/main.js#L31
    // Can be improved after resolution of https://github.com/nodejs/node/issues/49440
    const require = createRequire(import.meta.url);
    this.entryScriptDirectory = dirname(require.resolve(process.argv[1]));
    this.mafSourceDirectory = resolve(import.meta.dirname, '../');

    this.config = config;
    this._setDefaults()
    this.logger = new Logger(this);
    this.log = (...message) => {}; // function created by the logger
    this._log = this.logger.context(this, 'MAF');
    this.loaded = [];
    this.queue = [];
  }

  module(filepath, ...args) {
    this.log(`Loading a module from '${filepath}'`);
    return this._load(this.entryScriptDirectory, filepath, ...args);
  }
  builtin(name, ...args) {
    this.log(`Loading builtin module '${name}'`);
    return this._load(this.mafSourceDirectory, `./builtin/${name}/Module.js`, ...args);
  }
  async _load(root, filepath, ...args) {
    filepath = resolve(root, filepath);
    const modulePromise = import(`file://${filepath}`);
    const Module = (await modulePromise).default;
    let instance = new Module(this, ...args);
    this.loaded.push(instance);
    return instance;
  }
  _setDefaults() {
    const filepath = resolve(this.mafSourceDirectory, './default.yml');
    this.config.underLoadFile(filepath);
  }
  start() {
    this._handle_events();
    this.register(new Event('AppStart'));
    this._handle_events();
    this.log('Application started\n');
    setInterval(() => {this._handle_events();}, 5);
  }
  _handle_events() {
    while (this.queue.length) {
      let event = this.queue.shift();
      this.loaded.map(mod => {mod.handle(event);});
    }
  }
  register(event) {
    this.queue.push(event);
  }
}
