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

var fs = require('fs');

var path = require('path');

var parser = require('fast-xml-parser');

var sim_dict = JSON.parse(fs.readFileSync('./data/sim_dict.json', 'utf8'));

module.exports = function (app) {
  app.use('/doc', router);
};

var query_sim = function query_sim(uuid) {
  var list = sim_dict["".concat(uuid, ".pdf")] || [];
  return list.map(function (row) {
    return row.replace('.pdf', '');
  });
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
}(); // REST
//
//
//
//
// index
//
//
//
//


router.get('/',
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res, next) {
    var offset, limit, docs;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            offset = req.query.start || 0;
            limit = req.query.limit || 10;
            _context2.next = 4;
            return req.context.models.Doc.findAll({
              offset: offset,
              limit: limit,
              order: [['createdAt', 'DESC']]
            });

          case 4:
            docs = _context2.sent;
            return _context2.abrupt("return", res.send(docs));

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}()); // update
//
//
//
//

router.put('/:id',
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(req, res, next) {
    var id, doc, user, has, updated;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            id = req.params.id;
            _context3.next = 3;
            return req.context.models.Doc.findByPk(req.params.id);

          case 3:
            doc = _context3.sent;
            _context3.next = 6;
            return verify(req, res);

          case 6:
            user = _context3.sent;

            if (!(user instanceof Error)) {
              _context3.next = 10;
              break;
            }

            res.status(401).send({
              error: 'Invalid token.' + user.toString()
            });
            return _context3.abrupt("return");

          case 10:
            _context3.next = 12;
            return user.hasDocs(doc);

          case 12:
            has = _context3.sent;

            if (!has) {
              _context3.next = 20;
              break;
            }

            _context3.next = 16;
            return doc.update(req.body);

          case 16:
            updated = _context3.sent;
            return _context3.abrupt("return", res.status(200).send(updated));

          case 20:
            res.status(401).send({
              error: 'Invalid user.'
            });

          case 21:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x6, _x7, _x8) {
    return _ref3.apply(this, arguments);
  };
}()); // Create
//
//
//
// return

router.post('/',
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(req, res, next) {
    var title, uri, author, user, Doc;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            title = req.body.title;
            uri = req.body.uri;
            author = req.body.author; // Verify

            _context4.next = 5;
            return verify(req, res);

          case 5:
            user = _context4.sent;

            if (!(user instanceof Error)) {
              _context4.next = 9;
              break;
            }

            res.status(401).send({
              error: 'Invalid token.' + err
            });
            return _context4.abrupt("return");

          case 9:
            if (!(!validator.isEmpty(title) && validator.isURL(uri) && validator.isLength(title, {
              min: 2,
              max: 99
            }))) {
              _context4.next = 16;
              break;
            }

            _context4.next = 12;
            return req.context.models.Doc.create(req.body);

          case 12:
            Doc = _context4.sent;
            Doc.setUser(user).then(function () {
              res.status(200).send(Doc);
            });
            _context4.next = 17;
            break;

          case 16:
            // Error handle
            res.status(400).send({
              error: 'Missing field'
            });

          case 17:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x9, _x10, _x11) {
    return _ref4.apply(this, arguments);
  };
}()); // Search
//
//
//
// return

router.get('/search',
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(req, res, next) {
    var query, offset, limit, docs;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            query = req.query.q;
            offset = req.query.start || 0;
            limit = req.query.limit || 10;
            _context5.next = 5;
            return req.context.models.Doc.findAll({
              where: _defineProperty({}, _sequelize["default"].Op.or, [// { 'author': { [Sequelize.Op.iLike]: `%${query}%` } },
              // { 'author': { [Sequelize.Op.contains]: [{ [Sequelize.Op.iLike]: `%${query}%` }] } },
              // { 'author': [ query ] },
              {
                'author': _defineProperty({}, _sequelize["default"].Op.contains, [query])
              }, {
                'title': _defineProperty({}, _sequelize["default"].Op.iLike, "%".concat(query, "%"))
              }, {
                'summary': _defineProperty({}, _sequelize["default"].Op.iLike, "%".concat(query, "%"))
              }, {
                'publisher': _defineProperty({}, _sequelize["default"].Op.iLike, "%".concat(query, "%"))
              }]),
              offset: offset,
              limit: limit
            });

          case 5:
            docs = _context5.sent;
            return _context5.abrupt("return", res.status(200).send(docs));

          case 7:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function (_x12, _x13, _x14) {
    return _ref5.apply(this, arguments);
  };
}()); // Get one
//
//
//
//

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

            if (!(doc == null)) {
              _context6.next = 8;
              break;
            }

            return _context6.abrupt("return", res.status(403).send({
              error: 'doc not found.'
            }));

          case 8:
            return _context6.abrupt("return", res.status(200).send(doc));

          case 9:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function (_x15, _x16, _x17) {
    return _ref6.apply(this, arguments);
  };
}()); // Get similar docs
//
//
//
//

router.get('/:id/more',
/*#__PURE__*/
function () {
  var _ref7 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee7(req, res, next) {
    var id, limit, doc, more_docs_uuid, more_docs;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            id = req.params.id;
            limit = req.query.limit || 10;
            _context7.next = 4;
            return req.context.models.Doc.findByPk(req.params.id);

          case 4:
            doc = _context7.sent;
            more_docs_uuid = query_sim(doc.uuid) || [];
            _context7.next = 8;
            return req.context.models.Doc.findAll({
              where: {
                uuid: _defineProperty({}, _sequelize["default"].Op.or, more_docs_uuid)
              },
              limit: limit
            });

          case 8:
            more_docs = _context7.sent;
            more_docs.sort(function (doc1, doc2) {
              return more_docs_uuid.indexOf(doc1.uuid) - more_docs_uuid.indexOf(doc2.uuid);
            });
            return _context7.abrupt("return", res.status(200).send(more_docs));

          case 11:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function (_x18, _x19, _x20) {
    return _ref7.apply(this, arguments);
  };
}()); // Delete doc
//
//
//
//

router.post('/:id/delete',
/*#__PURE__*/
function () {
  var _ref8 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee8(req, res, next) {
    var id, doc, user, has;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            id = req.params.id;
            _context8.next = 3;
            return req.context.models.Doc.findByPk(req.params.id);

          case 3:
            doc = _context8.sent;
            _context8.next = 6;
            return verify(req, res);

          case 6:
            user = _context8.sent;

            if (!(user instanceof Error)) {
              _context8.next = 10;
              break;
            }

            res.status(401).send({
              error: 'Invalid token.' + user.toString()
            });
            return _context8.abrupt("return");

          case 10:
            _context8.next = 12;
            return user.hasDocs(doc);

          case 12:
            has = _context8.sent;

            if (!has) {
              _context8.next = 18;
              break;
            }

            doc.destroy();
            return _context8.abrupt("return", res.status(200).send(doc));

          case 18:
            res.status(401).send({
              error: 'Invalid user.'
            });

          case 19:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function (_x21, _x22, _x23) {
    return _ref8.apply(this, arguments);
  };
}()); // Get Doc Meta
//
//
//
// return

router.get('/:uuid/meta',
/*#__PURE__*/
function () {
  var _ref9 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee9(req, res, next) {
    var id, text, jsonObj, authors, date, keywords, meta;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            id = req.params.uuid;
            text = fs.readFileSync("./public/meta/".concat(id, ".tei.xml"), 'utf8');
            jsonObj = parser.parse(text);
            authors = jsonObj['TEI']['teiHeader']['fileDesc']['sourceDesc']['biblStruct']['analytic']['author'];
            date = jsonObj['TEI']['teiHeader']['fileDesc']['publicationStmt']['date'];
            keywords = jsonObj['TEI']['teiHeader']['profileDesc']['textClass'];
            meta = {
              title: jsonObj['TEI']['teiHeader']['fileDesc']['titleStmt']['title'],
              authors: authors ? (Array.isArray(authors) ? authors : [authors]).filter(function (x) {
                return x['persName'];
              }).map(function (x) {
                return (x['persName']['forename'] || '') + ' ' + (x['persName']['surname'] || '');
              }) : [],
              pubdate: date ? new Date(date) : new Date(),
              keywords: keywords ? keywords['keywords'] : [],
              abstracts: jsonObj['TEI']['teiHeader']['profileDesc']['abstract']['p'] || ''
            };
            res.status(200).send(meta);

          case 8:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function (_x24, _x25, _x26) {
    return _ref9.apply(this, arguments);
  };
}()); // Rate doc
//
//
//
// return

router.post('/:id/rating',
/*#__PURE__*/
function () {
  var _ref10 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee10(req, res, next) {
    var id, doc, user, prev, Rating, ratings, updated;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            id = req.params.id;
            _context10.next = 3;
            return req.context.models.Doc.findByPk(req.params.id);

          case 3:
            doc = _context10.sent;
            _context10.next = 6;
            return verify(req, res);

          case 6:
            user = _context10.sent;

            if (!(user instanceof Error)) {
              _context10.next = 10;
              break;
            }

            res.status(401).send({
              error: 'Invalid token.' + user.toString()
            });
            return _context10.abrupt("return");

          case 10:
            _context10.prev = 10;
            _context10.next = 13;
            return req.context.models.Rating.findOne({
              where: {
                docId: id,
                userId: user.id
              }
            });

          case 13:
            prev = _context10.sent;

            if (!prev) {
              _context10.next = 17;
              break;
            }

            res.status(401).send({
              error: 'you have rated this item.'
            });
            return _context10.abrupt("return");

          case 17:
            _context10.next = 19;
            return req.context.models.Rating.create(req.body);

          case 19:
            Rating = _context10.sent;
            Rating.setDoc(doc).then(function () {
              return Rating.setUser(user);
            }).then(function () {
              res.status(200).send(Rating);
            });
            _context10.next = 23;
            return req.context.models.Rating.findAll({
              where: {
                docId: id
              }
            });

          case 23:
            ratings = _context10.sent;
            doc.rating = ratings.reduce(function (ac, cur) {
              return ac + cur.rating;
            }, 0.0) / ratings.length;
            _context10.next = 27;
            return doc.update({
              rating: doc.rating
            });

          case 27:
            updated = _context10.sent;
            _context10.next = 33;
            break;

          case 30:
            _context10.prev = 30;
            _context10.t0 = _context10["catch"](10);
            res.status(401).send({
              error: 'Invalid rating.'
            });

          case 33:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, null, [[10, 30]]);
  }));

  return function (_x27, _x28, _x29) {
    return _ref10.apply(this, arguments);
  };
}());