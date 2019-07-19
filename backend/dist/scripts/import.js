"use strict";

require("dotenv/config");

require("@babel/polyfill");

var _models = _interopRequireDefault(require("../app/models"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Sequelize = require('sequelize');

var fs = require('fs');

var path = require('path');

var parser = require('fast-xml-parser');

if (process.argv.length < 4) {
  console.log('run node import.js [data_path] [public_path]');
  process.exit(1);
}

var data_path = process.argv[2];
var public_path = process.argv[3];
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
}); // copy thumb folder to public

var thumb_folder = fs.readdirSync("".concat(data_path, ".thumb")).forEach(function (file) {
  fs.copyFileSync(path.join("".concat(data_path, ".thumb"), file), path.join(public_path, 'thumbs', file));
}); // copy meta folder to public

var meta_folder = fs.readdirSync("".concat(data_path, ".meta")).forEach(function (file) {
  fs.copyFileSync(path.join("".concat(data_path, ".meta"), file), path.join(public_path, 'meta', file));
});

var createFromFile = function createFromFile(obj) {
  try {
    var text = fs.readFileSync(path.join("".concat(data_path, ".meta"), "".concat(obj['uuid'], ".tei.xml")), 'utf8');
    var jsonObj = parser.parse(text);
    var authors = jsonObj['TEI']['teiHeader']['fileDesc']['sourceDesc']['biblStruct']['analytic']['author'];
    var date = new Date(jsonObj['TEI']['teiHeader']['fileDesc']['publicationStmt']['date']);
    var keywords = jsonObj['TEI']['teiHeader']['profileDesc']['textClass'];
    var meta = {
      title: jsonObj['TEI']['teiHeader']['fileDesc']['titleStmt']['title'],
      authors: authors ? (Array.isArray(authors) ? authors : [authors]).filter(function (x) {
        return x['persName'];
      }).map(function (x) {
        return (x['persName']['forename'] || '') + ' ' + (x['persName']['surname'] || '');
      }) : [],
      pubdate: date.toString() === 'Invalid Date' ? new Date() : date,
      keywords: keywords ? keywords['keywords'] : [],
      abstracts: jsonObj['TEI']['teiHeader']['profileDesc']['abstract']['p'] || ''
    };
    return {
      title: meta['title'],
      author: meta['authors'],
      pubdate: meta['pubdate'],
      uri: obj['uri'],
      uuid: obj['uuid'],
      summary: meta['abstracts']
    };
  } catch (e) {
    return {
      title: obj['filename'].split('.')[0],
      uri: obj['uri'],
      uuid: obj['uuid'],
      summary: obj['page']
    };
  }
};

var docs_to_write = Object.keys(file_dict).map(function (id) {
  return createFromFile(file_dict[id]);
});

_models["default"].Doc.bulkCreate(docs_to_write).then(function () {
  console.log(docs_to_write.length + ' done.');
});