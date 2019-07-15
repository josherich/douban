"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var rating = function rating(sequelize, DataTypes) {
  var Rating = sequelize.define('rating', {
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    }
  });

  Rating.associate = function (models) {
    Rating.belongsTo(models.Doc);
    Rating.belongsTo(models.User);
  };

  return Rating;
};

var _default = rating;
exports["default"] = _default;