 const sequelize = require('../config/connection');
const { Model, DataTypes } = require('sequelize');

class Transactions extends Model{}

Transactions.init({
    id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    transactionType: {
        type: DataTypes.ENUM('Debit','Credit'),
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(256),
        allowNull: false,    
    },
    description: {
        type: DataTypes.STRING(1000),
        allowNull: true,
    },
    amount: {
       type: DataTypes.DECIMAL(10,2),
       allowNull: false,
       validate: {
        isDecimal: true,
       },  
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "categories",
            key: "id",
        },
    },
    personId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "person",
            key: "id",
        },
    },
},
{
    sequelize: sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: "transactions",
});
 
module.exports = Transactions;