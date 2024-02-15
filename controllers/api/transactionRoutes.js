const router = require('express').Router();
const isAuthorized = require('../../utils/authorization');
const { Categories, Transactions, Person } = require('../../models');

// the 'api/transactions' endpoint

//get all transactions
router.get('/', isAuthorized, async (req, res) => {
  try {
    const allTransaction = await Transactions.findAll({
      where: {
        personId: req.session.personId,
      },
    });
    res.status(200).json(allTransaction);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// create a new transaction
//request body should look like follow:
// {
//     "transactionType": "Debit",
//     "name": "Grocery",
//     "description": "target",
//     "amount": 200,
//     "date": "2024-02-14",
//     "categoryId": 1
//   }
router.post('/', isAuthorized, async (req, res) => {
  try {
    console.log('personId in session', req.session.personId);
    const newTransaction = await Transactions.create({
      transactionType: req.body.transactionType,
      name: req.body.name,
      description: req.body.description,
      amount: req.body.amount,
      date: req.body.date,
      categoryId: 1,
      personId: req.session.personId,
    });
    res.status(200).json(newTransaction);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// edit a specific transaction
router.put('/:id', isAuthorized, async (req, res) => {
  try {
    const updateTransaction = await Transactions.update(
      {
        transactionType: req.body.transactionType,
        name: req.body.name,
        description: req.body.description,
        amount: req.body.amount,
        date: req.body.date,
        categoryId: req.body.categoryId,
      },
      {
        where: {
          id: req.params.id,
          personId: req.session.personId,
        },
      }
    );
    res.status(200).json(updateTransaction);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});
// delete a specific transaction
router.delete('/:id', isAuthorized, async (req, res) => {
  try {
    await Transactions.destroy({
      where: {
        id: req.params.id,
        personId: req.session.personId,
      },
    });
    res.status(200).end();
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
