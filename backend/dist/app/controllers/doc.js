"use strict";

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var express = require('express');

var router = express.Router();

var jwt = require('jsonwebtoken');

var validator = require('validator');

module.exports = function (app) {
  app.use('/doc', router);
};

var verify =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res) {
    var token, decoded, user;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            token = req.get('Authorization').split(' ')[1];
            _context.prev = 1;
            decoded = jwt.verify(token, 'shxhxhxhx');
            _context.next = 5;
            return req.context.models.User.findOne({
              where: {
                email: decoded['email']
              }
            });

          case 5:
            user = _context.sent;

            if (user) {
              _context.next = 10;
              break;
            }

            return _context.abrupt("return", new Error('user not found'));

          case 10:
            return _context.abrupt("return", user);

          case 11:
            _context.next = 16;
            break;

          case 13:
            _context.prev = 13;
            _context.t0 = _context["catch"](1);
            return _context.abrupt("return", new Error(_context.t0));

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 13]]);
  }));

  return function verify(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
/* update todo. */


router.put('/:id',
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res, next) {
    var id, doc, user, has, updated;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            id = req.params.id;
            _context2.next = 3;
            return req.context.models.Doc.findByPk(req.params.id);

          case 3:
            doc = _context2.sent;
            _context2.next = 6;
            return verify(req, res);

          case 6:
            user = _context2.sent;

            if (!(user instanceof Error)) {
              _context2.next = 10;
              break;
            }

            res.status(401).send({
              error: 'Invalid token.' + user.toString()
            });
            return _context2.abrupt("return");

          case 10:
            _context2.next = 12;
            return user.hasDocs(doc);

          case 12:
            has = _context2.sent;

            if (!has) {
              _context2.next = 20;
              break;
            }

            _context2.next = 16;
            return doc.update(req.body);

          case 16:
            updated = _context2.sent;
            return _context2.abrupt("return", res.status(200).send(updated));

          case 20:
            res.status(401).send({
              error: 'Invalid user.'
            });

          case 21:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}()); // Create doc

router.post('/',
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(req, res, next) {
    var title, uri, author, user, Doc;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            title = req.body.title;
            uri = req.body.uri;
            author = req.body.author; // Verify

            _context3.next = 5;
            return verify(req, res);

          case 5:
            user = _context3.sent;

            if (!(user instanceof Error)) {
              _context3.next = 9;
              break;
            }

            res.status(401).send({
              error: 'Invalid token.' + err
            });
            return _context3.abrupt("return");

          case 9:
            if (!(!validator.isEmpty(title) && validator.isURL(uri) && validator.isLength(title, {
              min: 2,
              max: 99
            }))) {
              _context3.next = 16;
              break;
            }

            _context3.next = 12;
            return req.context.models.Doc.create(req.body);

          case 12:
            Doc = _context3.sent;
            Doc.setUser(user).then(function () {
              res.status(200).send(Doc);
            });
            _context3.next = 17;
            break;

          case 16:
            // Error handle
            res.status(400).send({
              error: 'Missing field'
            });

          case 17:
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
router.get('/search',
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(req, res, next) {
    var query, docs;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            query = req.query.q;
            _context4.next = 3;
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
            docs = _context4.sent;
            return _context4.abrupt("return", res.status(200).send(docs));

          case 5:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x9, _x10, _x11) {
    return _ref4.apply(this, arguments);
  };
}());
router.get('/',
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(req, res, next) {
    var docs;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return req.context.models.Doc.findAll();

          case 2:
            docs = _context5.sent;
            return _context5.abrupt("return", res.send(docs));

          case 4:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function (_x12, _x13, _x14) {
    return _ref5.apply(this, arguments);
  };
}()); // Get doc

router.get('/:id',
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(req, res, next) {
    var id, doc;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            id = req.params.id;
            _context6.next = 3;
            return req.context.models.Doc.findByPk(req.params.id);

          case 3:
            doc = _context6.sent;
            return _context6.abrupt("return", res.status(200).send(doc));

          case 5:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function (_x15, _x16, _x17) {
    return _ref6.apply(this, arguments);
  };
}()); // Delete doc

router.post('/:id/delete',
/*#__PURE__*/
function () {
  var _ref7 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee7(req, res, next) {
    var id, doc, user, has;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            id = req.params.id;
            _context7.next = 3;
            return req.context.models.Doc.findByPk(req.params.id);

          case 3:
            doc = _context7.sent;
            _context7.next = 6;
            return verify(req, res);

          case 6:
            user = _context7.sent;

            if (!(user instanceof Error)) {
              _context7.next = 10;
              break;
            }

            res.status(401).send({
              error: 'Invalid token.' + user.toString()
            });
            return _context7.abrupt("return");

          case 10:
            _context7.next = 12;
            return user.hasDocs(doc);

          case 12:
            has = _context7.sent;

            if (!has) {
              _context7.next = 18;
              break;
            }

            doc.destroy();
            return _context7.abrupt("return", res.status(200).send(doc));

          case 18:
            res.status(401).send({
              error: 'Invalid user.'
            });

          case 19:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function (_x18, _x19, _x20) {
    return _ref7.apply(this, arguments);
  };
}());