const doc = (sequelize, DataTypes) => {
  const Doc = sequelize.define('doc', {
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
    },
  });

  Doc.associate = models => {
    Doc.belongsTo(models.User);
  };

  return Doc;
};

export default doc;
