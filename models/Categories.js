const sequelize = require('../config/connection');
const { Model, DataTypes } = require('sequelize');

class Categories extends Model {}

Categories.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(256),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize: sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "categories",
  }
);

module.exports = Categories;
