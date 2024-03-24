import { dirname } from 'path';
import { existsSync, mkdirSync, createWriteStream } from 'fs';
import { formatDate, strFormat } from '../util.js';
import { format } from 'path';

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

export class ConsoleStream extends LoggerStream {
  constructor(useColors=true) {
    super(process.stdout, useColors);
  }
}

export class FileStream extends LoggerStream {
  constructor(app, filename, useColors=false) {
    filename = strFormat(filename, {today: formatDate(new Date())});
    let dir = dirname(filename);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    super(createWriteStream(filename, {flags:'a'}), useColors);
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
