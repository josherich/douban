var express = require('express')
var router = express.Router()
var jwt = require('jsonwebtoken')
var validator = require('validator')
var fs = require('fs')

import Sequelize from 'sequelize'
var sim_dict = JSON.parse(fs.readFileSync('./data/sim_dict.json', 'utf8'))

module.exports = function (app) {
  app.use('/doc', router)
}

const query_sim = (uuid) => {
  const list = sim_dict[`${uuid}.pdf`] || []
  return list.map(row => row.replace('.pdf', ''))
}

const verify = async (req, res) => {
  const token = req.get('Authorization').split(' ')[1]
  try {
    const decoded = jwt.verify(token, 'shxhxhxhx')
    const user = await req.context.models.User.findOne({ where: { email: decoded['email'] } })
    if (!user) {
      return new Error('user not found')
    } else {
      return user
    }
  } catch (err) {
    return new Error(err)
  }
}

/* update todo. */
router.put('/:id', async (req, res, next) => {
  const id = req.params.id;
  const doc = await req.context.models.Doc.findByPk(
    req.params.id,
  )
  // Verify
  const user = await verify(req, res)

  if (user instanceof Error) {
    res.status(401).send({
      error: 'Invalid token.' + user.toString()
    })
    return
  }
  // console.log(user.id, doc.user.id)
  const has = await user.hasDocs(doc)

  if (has) {
    const updated = await doc.update(req.body)
    return res.status(200).send(updated)
  } else {
    res.status(401).send({
      error: 'Invalid user.'
    })
  }

});

// Create doc
router.post('/', async (req, res, next) => {
  const title = req.body.title
  const uri = req.body.uri
  const author = req.body.author

  // Verify
  const user = await verify(req, res)

  if (user instanceof Error) {
    res.status(401).send({
     error: 'Invalid token.' + err
    })
    return
  }

  // Validator
  if (!validator.isEmpty(title) &&
      validator.isURL(uri) &&
      validator.isLength(title, {min: 2, max: 99})) {

    const Doc = await req.context.models.Doc.create(req.body)
    Doc.setUser(user).then(() => {
      res.status(200).send(Doc)
    })
  } else {
    // Error handle
    res.status(400).send({
      error: 'Missing field'
    })
  }
})

router.get('/search', async (req, res, next) => {
  const query = req.query.q
  const docs = await req.context.models.Doc.findAll({
      where: {
        [Sequelize.Op.or]: [
          // { 'author': { [Sequelize.Op.iLike]: `%${query}%` } },
          { 'title': { [Sequelize.Op.iLike]: `%${query}%` } },
          { 'summary': { [Sequelize.Op.iLike]: `%${query}%` } },
          { 'title': { [Sequelize.Op.iLike]: `%${query}%` } },
          { 'publisher': { [Sequelize.Op.iLike]: `%${query}%` } }
        ]
      }
  })
  return res.status(200).send(docs)
})

router.get('/', async (req, res, next) => {
  const offset = req.query.start || 0
  const limit = req.query.limit || 10
  const docs = await req.context.models.Doc.findAll({ offset: offset, limit: limit })
  return res.send(docs)
});

// Get doc
router.get('/:id', async (req, res, next) => {
  var id = req.params.id

  const doc = await req.context.models.Doc.findByPk(
    req.params.id,
  )
  return res.status(200).send(doc)
})

// Get similar docs
router.get('/:id/more', async (req, res, next) => {
  const id = req.params.id
  const limit = req.query.limit || 10

  const doc = await req.context.models.Doc.findByPk(
    req.params.id,
  )
  const more_docs_uuid = query_sim(doc.uuid) || []
  const more_docs = await req.context.models.Doc.findAll({
    where: {
      uuid: {
        [Sequelize.Op.or]: more_docs_uuid
      }
    },
    limit: limit
  })

  more_docs.sort((doc1, doc2) => {
    return more_docs_uuid.indexOf(doc1.uuid) - more_docs_uuid.indexOf(doc2.uuid)
  })
  return res.status(200).send(more_docs)
})

// Delete doc
router.post('/:id/delete', async (req, res, next) => {
  var id = req.params.id

  const doc = await req.context.models.Doc.findByPk(
    req.params.id,
  )

  // Verify
  const user = await verify(req, res)

  if (user instanceof Error) {
    res.status(401).send({
      error: 'Invalid token.' + user.toString()
    })
    return
  }
  // console.log(user.id, doc.user.id)
  const has = await user.hasDocs(doc)

  if (has) {
    doc.destroy()
    return res.status(200).send(doc)
  } else {
    res.status(401).send({
      error: 'Invalid user.'
    })
  }

})

