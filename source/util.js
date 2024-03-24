import { question } from 'readline-sync';

// Based on https://stackoverflow.com/a/18234317
export function strFormat(str, data) {
  for (let key in data) {
    str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), data[key] || '');
  }
  return str;
}

export function formatDate(date, sep='-') {
  let year = `${date.getFullYear()}`;
  let month = `0${date.getMonth()+1}`.slice(-2);
  let day = `0${date.getDate()}`.slice(-2);
  return `${year}${sep}${month}${sep}${day}`;
}

export function formatTime(date, sep=':') {
  let hour = `0${date.getHours()}`.slice(-2);
  let minute = `0${date.getMinutes()}`.slice(-2);
  let second = `0${date.getSeconds()}`.slice(-2);
  return `${hour}${sep}${minute}${sep}${second}`;
}

export function getType(value) {
  try {return value.constructor;}
  catch {return null;} // null or undefined
}

export function inputPassword(prompt) {
  return question(prompt, {hideEchoBack:true});
}
