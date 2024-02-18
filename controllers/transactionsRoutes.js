const router = require('express').Router();
const { Transactions, Categories, Person } = require('../models');
const isAuthorized = require('../utils/authorization');

router.get('/add', async (req, res) => {
  try {
    const allCategories = await Categories.findAll();
    const categories = allCategories.map((category) => category.get({plain: true}));
    res.render('addTransaction', {
      username: req.session.username,
      loggedIn: req.session.loggedIn,
      categories: categories,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
