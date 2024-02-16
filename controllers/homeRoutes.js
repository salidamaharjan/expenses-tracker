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

module.exports = router;