"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.sequelize = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var sequelize = new _sequelize["default"](process.env.DATABASE, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
  dialect: 'postgres'
});
exports.sequelize = sequelize;
var models = {
  User: sequelize["import"]('./user'),
  Doc: sequelize["import"]('./doc'),
  Rating: sequelize["import"]('./rating'),
  Like: sequelize["import"]('./like')
};
Object.keys(models).forEach(function (key) {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});
var _default = models;
exports["default"] = _default;