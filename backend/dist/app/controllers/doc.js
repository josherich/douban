"use strict";

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _readOnlyError(name) { throw new Error("\"" + name + "\" is read-only"); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var express = require('express');

var router = express.Router();

var jwt = require('jsonwebtoken');

var validator = require('validator');

module.exports = function (app) {
  app.use('/doc', router);
}; // Create doc


router.post('/',
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res, next) {
    var title, uri, author, user, token, Doc;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            title = req.body.title;
            uri = req.body.uri;
            author = req.body.author;
            user = null;
            token = req.get('Authorization').split(' ')[1]; // Verify

            jwt.verify(token, 'shxhxhxhx',
            /*#__PURE__*/
            function () {
              var _ref2 = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee(err, decoded) {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        if (!err) {
                          _context.next = 5;
                          break;
                        }

                        res.status(401).send({
                          error: 'Invalid token.' + err
                        });
                        return _context.abrupt("return");

                      case 5:
                        _readOnlyError("user");

                        _context.next = 8;
                        return req.context.models.User.findOne({
                          where: {
                            email: decoded['email']
                          }
                        });

                      case 8:
                        user = _context.sent;

                        if (user) {
                          _context.next = 12;
                          break;
                        }

                        res.status(401).send({
                          error: 'User not found.'
                        });
                        return _context.abrupt("return");

                      case 12:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x4, _x5) {
                return _ref2.apply(this, arguments);
              };
            }()); // Validator

            if (!(!validator.isEmpty(title) && validator.isURL(uri) && validator.isLength(title, {
              min: 2,
              max: 99
            }))) {
              _context2.next = 13;
              break;
            }

            _context2.next = 9;
            return req.context.models.Doc.create(req.body);

          case 9:
            Doc = _context2.sent;
            Doc.setUser(user).then(function () {
              res.status(200).send(Doc);
            });
            _context2.next = 14;
            break;

          case 13:
            // Error handle
            res.status(400).send({
              error: 'Missing field'
            });

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());
router.get('/search',
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(req, res, next) {
    var query, docs;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            query = req.query.q;
            _context3.next = 3;
            return req.context.models.Doc.findAll({
              where: _defineProperty({}, _sequelize["default"].Op.or, [// { 'author': { [Sequelize.Op.iLike]: `%${query}%` } },
              {
                'title': _defineProperty({}, _sequelize["default"].Op.iLike, "%".concat(query, "%"))
              }, {
                'summary': _defineProperty({}, _sequelize["default"].Op.iLike, "%".concat(query, "%"))
              }, {
                'title': _defineProperty({}, _sequelize["default"].Op.iLike, "%".concat(query, "%"))
              }, {
                'publisher': _defineProperty({}, _sequelize["default"].Op.iLike, "%".concat(query, "%"))
              }])
            });

          case 3:
            docs = _context3.sent;
            return _context3.abrupt("return", res.status(200).send(docs));

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x6, _x7, _x8) {
    return _ref3.apply(this, arguments);
  };
}());
router.get('/',
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(req, res, next) {
    var docs;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return req.context.models.Doc.findAll();

          case 2:
            docs = _context4.sent;
            return _context4.abrupt("return", res.send(docs));

          case 4:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x9, _x10, _x11) {
    return _ref4.apply(this, arguments);
  };
}()); // Get user

router.get('/:id',
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(req, res, next) {
    var id, doc;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            id = req.params.id;
            _context5.next = 3;
            return req.context.models.Doc.findByPk(req.params.id);

          case 3:
            doc = _context5.sent;
            return _context5.abrupt("return", res.status(200).send(doc));

          case 5:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function (_x12, _x13, _x14) {
    return _ref5.apply(this, arguments);
  };
}());