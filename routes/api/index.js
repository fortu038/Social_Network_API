const router = require('express').Router();
const thoguhtRoutes = require('./thoughtRoutes');
const userRoutes = require('./userRoutes');

router.use('/thoughts', thoguhtRoutes);
router.use('/users', userRoutes);

module.exports = router;