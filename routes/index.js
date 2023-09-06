const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const nonExistentRouter = require('./nonExistent');

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('*', nonExistentRouter);

module.exports = router;
