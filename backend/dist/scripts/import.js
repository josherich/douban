"use strict";

require("dotenv/config");

require("@babel/polyfill");

var _models = _interopRequireDefault(require("../app/models"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Sequelize = require('sequelize');

var fs = require('fs');

var path = require('path');

if (process.argv.length < 3) {
  console.log('run node import.js [data_path]');
  process.exit(1);
}

var data_path = process.argv[2];
var list_csv = fs.readFileSync("".concat(data_path, "/list.csv"), 'utf8');
var file_list = list_csv.split('\n').slice(1).map(function (e) {
  return e.split(',');
});
var file_dict = {};
file_list.filter(function (row) {
  return row.length === 6;
}).map(function (row) {
  var id = row[1].split('/')[2].replace('.pdf', '');
  file_dict[id] = {
    uri: row[2],
    page: row[3],
    filename: row[0],
    uuid: id
  };
});
var txt_folder = fs.readdirSync("".concat(data_path, ".txt")).forEach(function (file) {
  var text = fs.readFileSync(path.join("".concat(data_path, ".txt"), file), 'utf8');
  var uuid = file.split('.')[0];
  if (file_dict[uuid]) file_dict[uuid]['title'] = text.split('\n')[0];else {
    console.log('txt file id not found in csv', uuid);
  }
});

var createFromFile = function createFromFile(obj) {
  return {
    title: obj['title'],
    uri: obj['uri'],
    uuid: obj['uuid'],
    summary: obj['page']
  };
};

var docs_to_write = Object.keys(file_dict).map(function (id) {
  return createFromFile(file_dict[id]);
});

_models["default"].Doc.bulkCreate(docs_to_write).then(function () {
  console.log(docs_to_write.length + ' done.');
});