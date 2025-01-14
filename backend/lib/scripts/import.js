import 'dotenv/config';
import '@babel/polyfill';
import models from '../app/models'

const Sequelize = require('sequelize')
const fs = require('fs')
const path = require('path')
const parser = require('fast-xml-parser')

if (process.argv.length < 4) {
  console.log('run node import.js [data_path] [public_path]')
  process.exit(1)
}

const data_path = process.argv[2]
const public_path = process.argv[3]

const list_csv = fs.readFileSync(`${data_path}/../list.csv`, 'utf8')

const file_list = list_csv.split('\n').slice(1).map((e) => {
  return e.split(',')
})

const file_dict = {}

file_list
.filter(row => row.length === 6)
.map(row => {
  if (fs.existsSync(path.join(data_path, row[1].split('/')[2]))) {
    let id = row[1].split('/')[2].replace('.pdf', '')
    file_dict[id] = {
      uri: row[2],
      page: row[3],
      filename: row[0],
      uuid: id
    }
  }
})

// copy thumb folder to public
const thumb_folder = fs.readdirSync(`${data_path}.thumb`)
.forEach(file => {
  fs.copyFileSync(path.join(`${data_path}.thumb`, file), path.join(public_path, 'thumbs', file));
})

// copy meta folder to public
const meta_folder = fs.readdirSync(`${data_path}.meta`)
.forEach(file => {
  fs.copyFileSync(path.join(`${data_path}.meta`, file), path.join(public_path, 'meta', file));
})

const createFromFile = (obj) => {
  try {
    const text = fs.readFileSync(path.join(`${data_path}.meta`, `${obj['uuid']}.tei.xml`), 'utf8')
    const jsonObj = parser.parse(text)
    const authors = jsonObj['TEI']['teiHeader']['fileDesc']['sourceDesc']['biblStruct']['analytic']['author']
    const date = new Date(jsonObj['TEI']['teiHeader']['fileDesc']['publicationStmt']['date'])
    const keywords = jsonObj['TEI']['teiHeader']['profileDesc']['textClass']

    const meta = {
      title: jsonObj['TEI']['teiHeader']['fileDesc']['titleStmt']['title'],
      authors: authors ? (Array.isArray(authors) ? authors : [authors])
        .filter(x => x['persName'])
        .map(x => (x['persName']['forename'] || '') + ' ' + (x['persName']['surname'] || '')) : [],
      pubdate: date.toString() === 'Invalid Date' ? new Date() : date,
      keywords: keywords ? keywords['keywords'] : [],
      abstracts: jsonObj['TEI']['teiHeader']['profileDesc']['abstract']['p'] || ''
    }

    return {
      title: meta['title'],
      author: meta['authors'],
      pubdate: meta['pubdate'],
      uri: obj['uri'],
      uuid: obj['uuid'],
      summary: meta['abstracts'],
      publisher: obj['page']
    }
  } catch (e) {
    return {
      title: obj['filename'].split('.')[0],
      uri: obj['uri'],
      uuid: obj['uuid'],
      summary: obj['page'],
      publisher: obj['page']
    }
  }
}

let docs_to_write = Object.keys(file_dict).map(id => {
  return createFromFile(file_dict[id])
})

docs_to_write = docs_to_write.filter(async (d) => {
  return await models.Doc.findOne({
    where: {
      uri: d['uri']
    }
  });
})

models.Doc.bulkCreate(docs_to_write)
.then(() => {
  console.log(docs_to_write.length + ' done.')
})
