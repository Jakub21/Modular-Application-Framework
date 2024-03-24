import { ConsoleStream, FileStream } from './Stream.js';
import Context from './Context.js';
import { formatTime, strFormat } from '../util.js';

export default class Logger {
  constructor(app) {
    this._app = app;
    this._config = app.config.subnest('logger');
    this._COLORS = this._config.subnest('colors')._data;
    this._streams = [];
    if (this._config.get('console')) {
      this._streams.push(new ConsoleStream(this._config.get('console.colors')));
    }
  }
  context(instance, issuer) {
    let context = new Context(this, issuer);
    instance.log = (...message) => {context.entry(...message)};
    return context;
  }
  addStream(stream) {
    this._streams.push(stream);
  }
  entry(issuer, ...data) {
    data = data.map((part)=>{return `${part}`;}).join(' ');
    let time = formatTime(new Date());
    this._streams.map(stream => {
      let message = this._formatMessage({time, issuer, message:data}, stream.useColors);
      stream.write(message);
    });
  }
  _formatMessage(data, useColors) {
    data = {...data, ...(useColors? this._colorsData() : this._colorlessData())};
    let format = this._config.get('format');
    return strFormat(format, data);
  }
  _colorsData() { // Refactor?
    const COLORS = this._config.subnest('colors')._data;
    let entries = Object.entries(COLORS).map(([key, val]) => {return [`C_${key}`, `\x1b[${val}`]});
    let result = {};
    for (let [key, val] of entries) result[key] = val;
    return result;
  }
  _colorlessData() { // Refactor?
    const COLORS = this._config.subnest('colors')._data;
    let result = {};
    for (let key of Object.keys(COLORS)) result[`C_${key}`] = '';
    return result;
  }
}
