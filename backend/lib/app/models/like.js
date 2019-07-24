const like = (sequelize, DataTypes) => {
  const Like = sequelize.define('like', {
    count: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    }
  });

  Like.associate = models => {
    Like.belongsTo(models.Doc);
    Like.belongsTo(models.User);
  };

  return Like;
};

export default like;
