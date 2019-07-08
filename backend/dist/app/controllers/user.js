"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var express = require('express');

var router = express.Router();

var validator = require('validator');

var jwt = require('jsonwebtoken');

module.exports = function (app) {
  app.use('/user', router);
}; // signin user


router.post('/signin',
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res, next) {
    var email, pass, user, token;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            email = req.body.email;
            pass = req.body.pass; // Validator

            if (!(!validator.isEmpty(email) && !validator.isEmpty(pass) && validator.isEmail(email))) {
              _context.next = 9;
              break;
            }

            _context.next = 5;
            return req.context.models.User.findOne({
              where: {
                email: email
              }
            });

          case 5:
            user = _context.sent;

            if (user && pass === user.password) {
              token = jwt.sign({
                email: email,
                exp: Math.floor(Date.now() / 1000) + 3 * 30 * 24 * 3600 // three months

              }, 'shxhxhxhx');
              res.status(200).send({
                email: email,
                token: token
              });
            } else {
              res.status(400).send({
                error: 'Wrong password or email.'
              });
            }

            _context.next = 10;
            break;

          case 9:
            // Error handle
            res.status(400).send({
              error: 'Missing field'
            });

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}()); // Create user

router.post('/',
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res, next) {
    var email, pass, name, token, user;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            email = req.body.email;
            pass = req.body.pass;
            name = req.body.name; // Validator

            if (!(!validator.isEmpty(email) && !validator.isEmpty(name) && !validator.isEmpty(pass) && validator.isEmail(email) && validator.isLength(name, {
              min: 2,
              max: 10
            }))) {
              _context2.next = 11;
              break;
            }

            // Generate token
            token = jwt.sign({
              username: name,
              email: email,
              exp: Math.floor(Date.now() / 1000) + 600
            }, 'shxhxhxhx');
            _context2.next = 7;
            return req.context.models.User.create({
              username: name,
              email: email,
              password: pass
            });

          case 7:
            user = _context2.sent;
            res.status(200).send({
              username: name,
              email: email,
              token: token
            });
            _context2.next = 12;
            break;

          case 11:
            // Error handle
            res.status(400).send({
              error: 'Missing field'
            });

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}());
router.get('/',
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(req, res, next) {
    var users;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return req.context.models.User.findAll({
              attributes: ['username']
            });

          case 2:
            users = _context3.sent;
            return _context3.abrupt("return", res.send(users));

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}()); // Get user
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