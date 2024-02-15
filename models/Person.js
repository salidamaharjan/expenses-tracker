const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

class Person extends Model {
  checkPassword(loginPassword) {
    return bcrypt.compareSync(loginPassword, this.password);
  }
}

Person.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(256),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(256),
      allowNull: false,
      validate: {
        len: [8, 24],
      },
    },
  },
  {
    hooks: {
      async beforeCreate(newPerson) {
        newPerson.password = await bcrypt.hash(newPerson.password, 10);
        return newPerson;
      },
    },
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'person',
  }
);

module.exports = Person;
