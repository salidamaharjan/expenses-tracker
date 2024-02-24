const router = require('express').Router();
const isAuthorized = require('../../utils/authorization');
const { Person, Transactions, Categories } = require('../../models');
const sequelize = require('../../config/connection');
const { Op } = require('sequelize');

// the 'api/transactions' endpoint

// TODO: for all transaction getting routes, need to add handling to get from a specific time range
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

//get group by category transaction
router.get('/grouped-transactions', isAuthorized, async (req, res) => {
  try {
    const whereConditions = {
      personId: req.session.personId,
      transactionType: 'credit',
    };
    if (req.query.startDate && req.query.endDate) {
      whereConditions.date = {
        [Op.gte]: new Date(req.query.startDate),
        [Op.lt]: new Date(req.query.endDate),
      };
    }

    const groupedTransactions = await Transactions.findAll({
      where: whereConditions,
      attributes: [
        'category_id',
        [sequelize.fn('SUM', sequelize.col('amount')), 'total_amount'],
      ],
      include: [
        {
          model: Categories,
          attributes: ['name'],
        },
      ],
      group: ['category_id'],
    });
    res.status(200).json(groupedTransactions);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//get and group transactions by name
router.get('/name-transactions', isAuthorized, async (req, res) => {
  try {
    const whereConditions = {
      personId: req.session.personId,
      transactionType: 'credit',
    };
    if (req.query.startDate && req.query.endDate) {
      whereConditions.date = {
        [Op.gte]: new Date(req.query.startDate),
        [Op.lt]: new Date(req.query.endDate),
      };
    }
    const groupedTransactions = await Transactions.findAll({
      where: whereConditions,
      attributes: [
        [sequelize.fn('upper', sequelize.col('name')), 'name'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'total_amount'],
      ],
      group: [sequelize.fn('upper', sequelize.col('name'))],
    });
    res.status(200).json(groupedTransactions);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// get all credit transactions
router.get('/credit-transactions', isAuthorized, async (req, res) => {
  try {
    const whereConditions = {
      personId: req.session.personId,
      transactionType: 'credit',
    };
    if (req.query.startDate && req.query.endDate) {
      whereConditions.date = {
        [Op.gte]: new Date(req.query.startDate),
        [Op.lt]: new Date(req.query.endDate),
      };
    }
    const allTransaction = await Transactions.findAll({
      where: whereConditions,
      attributes: [
        [sequelize.fn('upper', sequelize.col('name')), 'name'],
        ['amount', 'total_amount'],
      ],
    });
    res.status(200).json(allTransaction);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// get all debit transactions
router.get('/debit-transactions', isAuthorized, async (req, res) => {
  try {
    const whereConditions = {
      personId: req.session.personId,
      transactionType: 'debit',
    };
    if (req.query.startDate && req.query.endDate) {
      whereConditions.date = {
        [Op.gte]: new Date(req.query.startDate),
        [Op.lt]: new Date(req.query.endDate),
      };
    }
    const allTransaction = await Transactions.findAll({
      where: whereConditions,
      attributes: [
        [sequelize.fn('upper', sequelize.col('name')), 'name'],
        ['amount', 'total_amount'],
      ],
    });
    res.status(200).json(allTransaction);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//get credit transactions in a specfic category over time
router.get('/time-categories', isAuthorized, async (req, res) => {
  try {
    const date = new Date();
    const dateYearBefore = new Date(date.getFullYear(), date.getMonth() - 12);
    const groupedTransactions = await Transactions.findAll({
      where: {
        personId: req.session.personId,
        transactionType: 'credit',
        date: {
          [Op.gte]: dateYearBefore,
        },
      },
      include: [
        {
          model: Categories,
          where: {
            name: req.query.name,
          },
        },
      ],
      attributes: [
        [sequelize.fn('MONTH', sequelize.col('date')), 'month'],
        [sequelize.fn('YEAR', sequelize.col('date')), 'year'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'total_amount'],
      ],
      group: ['month', 'year'],
      order: [
        ['year', 'asc'],
        ['month', 'asc'],
      ],
    });
    res.status(200).json(groupedTransactions);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});
//get credit transactions in a specfic name over time
router.get('/time-names', isAuthorized, async (req, res) => {
  try {
    const date = new Date();
    const dateYearBefore = new Date(date.getFullYear(), date.getMonth() - 12);

    const groupedTransactions = await Transactions.findAll({
      where: {
        personId: req.session.personId,
        transactionType: 'credit',
        name: req.query.name,
        date: {
          [Op.gte]: dateYearBefore,
        },
      },
      attributes: [
        [sequelize.fn('MONTH', sequelize.col('date')), 'month'],
        [sequelize.fn('YEAR', sequelize.col('date')), 'year'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'total_amount'],
      ],
      group: ['month', 'year'],
      order: [
        ['year', 'asc'],
        ['month', 'asc'],
      ],
    });
    res.status(200).json(groupedTransactions);
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
      categoryId: req.body.categoryId,
      personId: req.session.personId,
    });
    res.status(200).json(newTransaction);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});
// update a person's chart options
router.put('/options', isAuthorized, async (req, res) => {
  try {
    const updatePerson = await Person.update(
      {
        groupOptions: req.body.groupOptions,
        timeOptions: req.body.timeOptions,
      },
      {
        where: {
          id: req.session.personId,
        },
      }
    );
    res.status(200).json(updatePerson);
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

// get a person's chart options
router.get('/options', isAuthorized, async (req, res) => {
  try {
    const personOptions = await Person.findByPk(req.session.personId, {
      attributes: ['group_options', 'time_options'],
    });
    res.status(200).json(personOptions);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
