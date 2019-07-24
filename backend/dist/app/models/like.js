"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var like = function like(sequelize, DataTypes) {
  var Like = sequelize.define('like', {
    count: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    }
  });

  Like.associate = function (models) {
    Like.belongsTo(models.Doc);
    Like.belongsTo(models.User);
  };

  return Like;
};

var _default = like;
exports["default"] = _default;