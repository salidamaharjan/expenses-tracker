const { Person, Transactions, Categories } = require('../models');
const seedCategories = require('./categorySeeds');
const sequelize = require('../config/connection');

sequelize.sync({ force: true }).then( async () => {
  seedCategories();
  await Person.create({
    username: "abcd",
    password: "password"
  })
  console.log('Tables Created');
});
