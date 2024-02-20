const router = require('express').Router();
const { Categories, Transactions, Person } = require('../models');
const withAuth = require('../utils/authorization');

// the '' endpoint

// homepage
router.get('/', async (req, res) => {
  try {
    res.render('homepage', {
      loggedIn: req.session.loggedIn,
    });
  } 
  catch (error) {
      console.log(error);
      res.status(500).json(error);
  }
});

//login page
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
      res.redirect('/');
      return;
    }
  
    res.render('login');
});

// ALL transactions page
router.get('/transactions', withAuth, async (req, res) => {
  try {
    const transactionsData = await Transactions.findAll({
      where: {
        personId: req.session.personId, // might need to change
      },
      include: [{ model: Categories }],
      order: [['date', 'DESC']],
    });
    const transactions = transactionsData.map((transaction) => transaction.get({ plain: true}));

    res.render('transactions', {
      transactions,
      loggedIn: req.session.loggedIn
    });
  } catch (error){
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;