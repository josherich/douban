var express = require('express')
var router = express.Router()

var validator = require('validator')
var jwt = require('jsonwebtoken')

module.exports = function (app) {
  app.use('/user', router)
}

// signin user
//
//
//
//
router.post('/signin', async (req, res, next) => {
  var email = req.body.email
  var pass = req.body.pass

  // Validator
  if (!validator.isEmpty(email) && !validator.isEmpty(pass) && validator.isEmail(email)) {
    const user = await req.context.models.User.findOne({ where: { email: email } })

    if (user && pass === user.password) {
      var token = jwt.sign({
        email: email,
        exp: Math.floor(Date.now() / 1000) + 3 * 30 * 24 * 3600 // three months
      }, 'shxhxhxhx')

      res.status(200).send({
        email: email,
        token: token
      })
    } else {
      res.status(400).send({
        error: 'Wrong password or email.'
      })
    }

  } else {
    // Error handle
    res.status(400).send({
      error: 'Missing field'
    })
  }

})

// Create user
//
//
//
//
router.post('/', async (req, res, next) => {
  var email = req.body.email
  var pass = req.body.pass
  var name = req.body.name

  // Validator
  if (!validator.isEmpty(email) && !validator.isEmpty(name) &&
      !validator.isEmpty(pass) && validator.isEmail(email) &&
      validator.isLength(name, {min: 2, max: 10})) {
    // Generate token
    var token = jwt.sign({
      username: name,
      email: email,
      exp: Math.floor(Date.now() / 1000) + 3 * 30 * 24 * 3600
    }, 'shxhxhxhx')

    try {
      const user = await req.context.models.User.create({
        username: name,
        email: email,
        password: pass
      })
      res.status(200).send({
        username: name,
        email: email,
        token: token
      })
    } catch (err) {
      res.status(401).send({
        error: err.errors[0].message
      })
    }

  } else {
    // Error handle
    res.status(401).send({
      error: 'Missing field'
    })
  }
})

// index
//
//
//
//
router.get('/', async (req, res, next) => {
  const users = await req.context.models.User.findAll({attributes: ['username']})
  return res.send(users)
});

// Get user
//
//
//
//
// router.get('/:id', function (req, res, next) {
//   var id = req.params.id
//   if (req.get('Authorization') == undefined)
//     res.status(401).send({
//       error: 'Invalid token'
//     })

//   var token = req.get('Authorization').split(' ')[1]

//   // Verify
//   jwt.verify(token, 'shxhxhxhx', async (err, decoded) => {
//     // Error handle
//     if (err) {
//       // If the user is legitimate, but token fails
//       // you can re generate token
//       res.status(401).send({
//         error: 'Invalid token'
//       })
//     } else {
//       // Authorization sucess return token
//       const user = await req.context.models.User.findByPk(
//         req.params.userId,
//       )
//       // user.token = token
//       return res.send(user)
//     }
//   })
// })
