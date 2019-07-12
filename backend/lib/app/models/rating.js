const rating = (sequelize, DataTypes) => {
  const Rating = sequelize.define('rating', {
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    }
  });

  Rating.associate = models => {
    Rating.belongsTo(models.Doc);
    Rating.belongsTo(models.User);
  };

  return Rating;
};

export default rating;
