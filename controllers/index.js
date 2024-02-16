const router = require('express').Router();

const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes');
const transactionRoutes = require('./transactionRoutes');

router.use('/', homeRoutes);
router.use('/api', apiRoutes);
router.use('/transaction', transactionRoutes);

module.exports = router;