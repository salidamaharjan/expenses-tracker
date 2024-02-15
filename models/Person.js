const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Person extends Model { }

Person.init({
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
    },
},
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'person',
    });

module.exports = Person;