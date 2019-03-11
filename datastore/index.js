const fs = require("fs");
const path = require("path");
const _ = require("underscore");
const counter = require("./counter");

// Public API - Fix these CRUD functions ///////////////////////////////////////

var data = [];

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      throw "Could not get ID.";
    } else {
      fs.writeFile(path.join(__dirname, "/data/" + id + ".txt"), text, err => {
        if (err) {
          throw "Could not save file.";
        }
        callback(null, { id, text });
      });
    }
  });
  // write new file to disk
  // name is ID
  // body is body text
};

exports.readAll = callback => {
  fs.readdir(path.join(__dirname, "/data"), (err, files) => {
    _.map(files, filePath => {
      exports.readOne(filePath.split(".")[0], (error, fileData) => {
        if (!error) {
          data.push(fileData);
        }
      });
    });
  });

  callback(null, data);
};

exports.readOne = (id, callback) => {
  fs.readFile(path.join(__dirname, "/data/" + id + ".txt"), (err, text) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text: text.toString() });
    }
  });
};

exports.update = (id, text, callback) => {
  fs.writeFile(path.join(__dirname, "/data/" + id + ".txt"), (text, err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    }
    callback(null, { id, text });
  });
};

exports.delete = (id, callback) => {
  fs.unlink(path.join(__dirname, "/data/" + id + ".txt"), err => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, "data");

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
