const router = require('express').Router();
const { Transactions, Categories, Person } = require('../models');
const isAuthorized  = require('../utils/authorization');

router.get('/', isAuthorized, async (req, res) => {
  try{
    const allTransactions = await Transactions.findAll({
      include: {
        model: Person,
        attributes: ['id', 'username'],
      },
      include: {
        model: Categories,
      },
    });
    const transactions = allTransactions.map((transaction) =>
      transaction.get({ plain: true })
    );
    res.render('transaction', {
      transactions: transactions,
      username: req.session.username,
      loggedIn: req.session.loggedIn,
    });
    res.status(200).json(transactions);
  }catch(err){
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
