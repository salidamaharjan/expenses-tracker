const router = require('express').Router();
const { Categories, Transactions, Person } = require('../models');
const withAuth = require('../utils/authorization');

// the '' endpoint

// homepage
router.get('/', async (req, res) => {
    try {
        
    } catch (error) {
        
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