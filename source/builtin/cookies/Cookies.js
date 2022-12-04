
module.exports = class Cookies {
  constructor(req, prefix) {
    this.prefix = prefix;
    let raw = req.headers.cookie;
    this._cookies = {};
    if (raw == undefined) return;
    for (let entry of raw.split(';')) {
      if (!entry.includes('=')) continue;
      let [key, val] = entry.split('=');
      if (key.startswith(this.prefix)) this._cookies[key.slice(this.prefix.length)] = val;
    }
  }
  get(key, def=undefined) {
    return this._cookies[key] || def;
  }
  keys() {
    return Object.keys(this._cookies);
  }
}
