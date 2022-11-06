
module.exports = class DataNest {
  constructor() {
    this._data = {};
  }
  set(path, val) {
    // Creates or overwrites a value
    this._data[path] = val;
  }
  get(path) {
    // Returns a single value
    return this._data[path];
  }
  getScope(path) {
    // Returns an object with all values whose path start with the one specified 
    let subset = Object.entries(this._data).filter(
      ([key, val]) => { return key.startsWith(path) });
    let data = {};
    for (let [key, val] of subset) { data[key.slice(path.length+1)] = val; }
    return data;
  }
  subnest(path) {
    let data = this.getScope(path);
    let other = new this.constructor();
    Object.entries(data).map(([key, val]) => {other.set(key, val)});
    return other;
  }
  exists(path) {
    // Checks if path already exists
    return Object.keys(this._data).includes(path);
  }
  underwrite(path, val, condition) {
    // Set path but only if condition is met
    // By default condition = check if exists
    if (condition == undefined) {
      condition = () => { return !this.exists(path) };
    }
    if (!condition()) return;
    this.set(path, val);
  }
}

/*
NOTE: This model supports sub-values of non-object entries
this means that the example below is a valid configuration
and `q` is NOT an object that holds `q.details` inside

q: false
q.details:
  a: 1
  b: 2

in subnest(q) the root value can be accessed with a key ''
example:
sub = subnest('q')
root = sub.get('') // false

*/
