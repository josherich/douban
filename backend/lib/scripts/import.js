import 'dotenv/config';
const Sequelize = require('sequelize');
const fs = require('fs')
const path = require('path')

// read csv file list
// import to postgres
import models from '../app/models'

if (process.argv.length < 3) {
  console.log('run node import.js [data_path]')
  process.exit(1)
}

const data_path = process.argv[2]

const list_csv = fs.readFileSync(`${data_path}/list.csv`, 'utf8')

const file_list = list_csv.split('\n').slice(1).map((e) => {
  return e.split(',')
})

const file_dict = {}

file_list
.filter(row => row.length === 6)
.map(row => {
  let id = row[1].split('/')[2].replace('.pdf', '')
  file_dict[id] = {
    uri: row[2],
    page: row[3],
    filename: row[0],
    uuid: id
  }
})

// console.log(file_dict)

const txt_folder = fs.readdirSync(`${data_path}/txt`)
.forEach(file => {
  console.log(file)
  let text = fs.readFileSync(path.join(`${data_path}/txt`, file), 'utf8')
  let uuid = file.split('.')[0]
  console.log(uuid)
  file_dict[uuid]['title'] = text.split('\n')[0]
})

const createFromFile = (obj) => {
  return {
    title: obj['title'],
    uri: obj['uri'],
    uuid: obj['uuid'],
    summary: obj['page']
  }
}

let docs_to_write = Object.keys(file_dict).map(id => {
  return createFromFile(file_dict[id])
})

console.log(docs_to_write)

models.Doc.bulkCreate(docs_to_write)
.then(() => {
  console.log(docs_to_write.length + ' done.')
})

