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
    if (err) {
      throw "Could not read files.";
    } else {
      Promise.all(
        files.map(filePath => {
          return exports.readOneAsync(filePath.split(".")[0]);
        })
      )
        .then(results => callback(null, results))
        .catch(err => callback(err, null));
    }
  });

  // fs.readdir(exports.dataDir, (err, files) => {
  //   if (err) {
  //     throw "Could not read files.";
  //   } else {
  //     callback(
  //       null,
  //       _.map(files, file => {
  //         return { id: file.split(".")[0], text: file.split(".")[0] };
  //       })
  //     );
  //   }
  // });
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

exports.readOneAsync = id => {
  return new Promise((resolve, reject) => {
    fs.readFile(`${exports.dataDir}/${id}.txt`, (err, text) => {
      if (err) {
        reject(new Error(`No item with id: ${id}`));
      } else {
        resolve({ id, text: text.toString() });
      }
    });
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
