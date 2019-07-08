"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var doc = function doc(sequelize, DataTypes) {
  var Doc = sequelize.define('doc', {
    title: DataTypes.STRING,
    author: DataTypes.ARRAY(DataTypes.STRING),
    uri: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rating: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    publisher: {
      type: DataTypes.STRING,
      allowNull: true
    },
    arxivId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    category: {
      type: DataTypes.STRING,
      defaultValue: "any"
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isbn10: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isbn13: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pubdate: {
      type: DataTypes.DATE,
      defaultValue: sequelize.NOW
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    pages: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    price: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0
    }
  });

  Doc.associate = function (models) {
    Doc.belongsTo(models.User);
  };

  return Doc;
};

var _default = doc;
exports["default"] = _default;