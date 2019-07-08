"use strict";

require("dotenv/config");

require("@babel/polyfill");

var _models = _interopRequireWildcard(require("./app/models"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var express = require('express');

var config = require('./config/config');

var app = express();
module.exports = require('./config/express')(app, config);
var eraseDatabaseOnSync = false;

var createUsersWithMessages =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _models["default"].User.create({
              username: 'abc',
              email: 'abc@gmail.com',
              password: '96e79218965eb72c92a549dd5a330112'
            });

          case 2:
            _context.next = 4;
            return _models["default"].Doc.create({
              "title": "The Probablistic Method",
              "author": ["Andrew Lin"],
              "rating": 7,
              "uri": "https://www.dropbox.com/sh/vkexrfecjdgej9j/AADxKV1NEiQuTDhuXVqdJm7ra?dl=0&preview=all-notes-up-to-spring-break.pdf",
              "publisher": "MIT",
              "category": "Math",
              "image": null,
              "isbn10": null,
              "isbn13": null,
              "pubdate": null,
              "summary": "",
              "pages": "0",
              "price": 0,
              "userId": 1
            });

          case 4:
            _context.next = 6;
            return _models["default"].Doc.create({
              "title": "Concentration of Markov chains with bounded moments",
              "author": ["Assaf Naor", "Shravas Rao", "Oded Regev"],
              "rating": 7,
              "uri": "https://arxiv.org/pdf/1906.07260",
              "arxivId": "1906.07260",
              "publisher": "arxiv",
              "category": "Math",
              "image": null,
              "isbn10": null,
              "isbn13": null,
              "pubdate": null,
              "summary": "Let {Wt}∞t=1 be a finite state stationary Markov chain, and suppose that f is a real-valued function on the state space. If f is bounded, then Gillman's expander Chernoff bound (1993) provides concentration estimates for the random variable f(W1)+⋯+f(Wn) that depend on the spectral gap of the Markov chain and the assumed bound on f. Here we obtain analogous inequalities assuming only that the q'th moment of f is bounded for some q≥2. Our proof relies on reasoning that differs substantially from the proofs of Gillman's theorem that are available in the literature, and it generalizes to yield dimension-independent bounds for mappings f that take values in an Lp(μ) for some p≥2, thus answering (even in the Hilbertian special case p=2) a question of Kargin (2007).",
              "pages": "0",
              "price": 0,
              "userId": 1
            });

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function createUsersWithMessages() {
    return _ref.apply(this, arguments);
  };
}();

_models.sequelize.sync({
  force: eraseDatabaseOnSync
}).then(function () {
  if (eraseDatabaseOnSync) {
    createUsersWithMessages();
  }

  app.listen(config.port, function () {
    console.log('Express server listening on port ' + config.port);
  });
});