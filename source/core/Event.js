
module.exports = class Event {
  constructor(key, data={}) {
    this.key = key;
    this.data = data;
    this.emitter = undefined;
  }
  assign(mod) {
    this.emitter = mod;
  }
}
