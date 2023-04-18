const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, countStr) => {
    // create file name based on uniq id and save text in there (write path and file name)
    // exports.counterFile = path.join(__dirname, 'counter.txt');
    // exports.dataDir = path.join(__dirname, 'data');
    var filePath = path.join(exports.dataDir, countStr + '.txt');
    // invoke fs.writefile (async)
    fs.writeFile(filePath, text, (err) => {
      if (err) {
        callback(err, null);
        // or use ==> throw ('error writing counter');
      } else {
        // callback
        callback(null, {id: countStr, text});
      }
    });
  });
  // var id = counter.getNextUniqueId();
  // items[id] = text;
  // callback(null, { id, text });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(err, null);
    } else {
      var result = [];
      //create an array of objects like this ==> { id, text }
      if (files.length > 0) {
        files.forEach((file) => {
          file = {id: file.slice(0, -4), text: file.slice(0, -4)};
          result.push(file);
          // console.log(file);
          // // [{id, text}, {id, text}];
          // console.log(files);
        });
      }
      callback(null, result);
    }
  });
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
