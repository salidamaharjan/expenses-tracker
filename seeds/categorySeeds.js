const sequelize = require('../config/connection');
const Categories = require('../models/Categories');

const categoryData = [
    {name: 'Food'},
    {name: 'Housing & Utilities'},
    {name: 'Transportation'},
    {name: 'Clothing'},
    {name: 'Other'},
];

const seedCategories = async () => {
    try {
        await sequelize.sync({ force: true });
        await Categories.bulkCreate(categoryData, { validate: true });
        console.log('Categories have been seeded!');

    } catch (error) {
        console.error('There was an error seeding categories:', error);
    }
};

seedCategories();