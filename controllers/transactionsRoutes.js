const router = require('express').Router();
const { Person, Categories, Transactions } = require('../models');
const isAuthorized = require('../utils/authorization');

router.get('/add', isAuthorized, async (req, res) => {
  try {
    const allCategories = await Categories.findAll();
    const categories = allCategories.map((category) =>
      category.get({ plain: true })
    );
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

router.get('/:id/edit', isAuthorized, async (req, res) => {
  try {
    const transactionWithId = await Transactions.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: Person,
          attributes: ['id', 'username'],
        },
        {
          model: Categories
        },
      ],
    });
    const transaction = transactionWithId.get({ plain: true });
    console.log('transaction-->', transaction);
    res.render('editTransaction', {
      username: req.session.username,
      loggedIn: req.session.loggedIn,
      transaction: transaction,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
