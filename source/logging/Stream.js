const path = require('path');
const fs = require('fs');
const {formatDate, strFormat} = require('../util');
const { format } = require('path');

class LoggerStream {
  constructor(stream, useColors) {
   this.stream = stream;
   this.useColors = useColors;
  }
  write(data) {
    this.stream.write(data+'\n');
  }
  close() {}
}

module.exports.ConsoleStream = class ConsoleStream extends LoggerStream {
  constructor(useColors=true) {
    super(process.stdout, useColors);
  }
}

module.exports.FileStream = class FileStream extends LoggerStream {
  constructor(app, filename, useColors=false) {
    filename = strFormat(filename, {today: formatDate(new Date())});
    let dir = path.dirname(filename);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    super(fs.createWriteStream(filename, {flags:'a'}), useColors);
    this.writeNewSession();
    this.filename = filename;
  }
  close() {
    this.stream.end();
  }
  writeNewSession(replace) {
    this.write(`\n\nNew session\n` || replace);
  }
}
