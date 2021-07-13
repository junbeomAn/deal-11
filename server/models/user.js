module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true, 
    },
    location_one: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    location_two: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  }, {
    timestamps: false,
    underscoped: true,
  });

  return User;
}