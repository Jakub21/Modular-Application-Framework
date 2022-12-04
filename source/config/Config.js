require('dotenv/config');
const YAML = require('yaml');
const fs = require('fs');
const DataNest = require('./DataNest.js');
const {getType} = require('../util');

const PRIMITIVES = [Boolean, Number, String, Array, null];

module.exports = class MafConfig extends DataNest {
  constructor() {
    super();
  }
  loadEnv(variables=[], asKey='env') {
    variables.map(name => {
      this.set(`${asKey}.${name}`, process.env[name]);
    });
  }
  // data loaders
  load(data, prefix='') {
    this._load(data, prefix, (...args)=>{this.set(...args)});
  }
  underLoad(data, prefix='') {
    this._load(data, prefix, (...args)=>{this.underwrite(...args)});
  }
  _load(data, prefix='', setter) {
    for (let [path, val] of Object.entries(data)) {
      if (PRIMITIVES.includes(getType(val))) {
        setter(prefix+path, val);
      } else {
        this._load(val, prefix+path+'.', setter);
      }
    }
  }
  // file loaders
  loadFile(path) {
    this.load(this._loadFile(path));
  }
  underLoadFile(path) {
    this.underLoad(this._loadFile(path));
  }
  _loadFile(path) {
    return YAML.parse(fs.readFileSync(path, 'utf-8'));
    // TODO: Validate
  }
}
