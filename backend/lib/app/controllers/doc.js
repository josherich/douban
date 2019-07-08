var express = require('express')
var router = express.Router()
var jwt = require('jsonwebtoken')

var validator = require('validator')

import Sequelize from 'sequelize'

module.exports = function (app) {
  app.use('/doc', router)
}

// Create doc
router.post('/', async (req, res, next) => {
  const title = req.body.title
  const uri = req.body.uri
  const author = req.body.author

  const user = null
  const token = req.get('Authorization').split(' ')[1]

  // Verify
  jwt.verify(token, 'shxhxhxhx', async (err, decoded) => {
    if (err) {
      res.status(401).send({
       error: 'Invalid token.' + err
      })
      return
    } else {
      user = await req.context.models.User.findOne({ where: { email: decoded['email'] } })
      if (!user) {
        res.status(401).send({
         error: 'User not found.'
        })
        return
      }
    }
  })

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
  const docs = await req.context.models.Doc.findAll()
  return res.send(docs)
});

// Get user
router.get('/:id', async (req, res, next) => {
  var id = req.params.id

  const doc = await req.context.models.Doc.findByPk(
    req.params.id,
  )
  return res.status(200).send(doc)
})
