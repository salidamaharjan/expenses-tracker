const router = require('express').Router();

const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes');
const transactionRoutes = require('./transactionsRoutes');

router.use('/', homeRoutes);
router.use('/api', apiRoutes);
router.use('/transactions', transactionRoutes);

module.exports = router;