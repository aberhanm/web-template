const fs = require('fs');
const path = require('path');
const parser = require('./yapi.parser');

fs.readdir(path.resolve(__dirname, '../types/yapi'), (err, files) => {
  if (err) return console.error(err)
  files.forEach(fileName => {
    const args = fileName.split(/\_|\./);
    const isObj = args.indexOf('OBJ') > -1;
    const isType = args.indexOf('TYPE') > -1;
    const token = args[0].toLowerCase();
    parser(args[1], isObj, isType, token)
  })
})
