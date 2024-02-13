const Categories = require('./Categories');
const Transactions = require('./Transactions');

Transactions.belongsTo(Categories);

Categories.hasMany(Transactions);

module.exports = { Categories, Transactions };
