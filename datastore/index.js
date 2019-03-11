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
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, err => {
        if (err) {
          throw "Could not save file.";
        }
        callback(null, { id, text });
      });
    }
  });
};

exports.readAll = callback => {
  fs.readdir(exports.dataDir, (err, files) => {
    let todos = [];
    for (let i = 0; i < files.length; i++) {
      let text = fs.readFileSync(exports.dataDir + "/" + files[i]).toString();
      todos.push({ id: files[i].split(".")[0], text: text });
    }

    callback(null, todos);
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, (err, text) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text: text.toString() });
    }
  });
};

exports.update = (id, text, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, (err, file) => {
    if (!err && file) {
      fs.writeFile(exports.dataDir + "/" + id + ".txt", text, err => {
        if (err) {
          throw "Could not write file";
        }
        callback(null, { id, text });
      });
    } else {
      callback(new Error(`No item with id: ${id}`));
    }
  });
};

exports.delete = (id, callback) => {
  fs.unlink(`${exports.dataDir}/${id}.txt`, err => {
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
