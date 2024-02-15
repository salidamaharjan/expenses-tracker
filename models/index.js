const Categories = require('./Categories');
const Transactions = require('./Transactions');
const Person = require('./Person');

Transactions.belongsTo(Categories);

Categories.hasMany(Transactions);

Person.hasMany(Transactions);

module.exports = { Categories, Transactions, Person };
