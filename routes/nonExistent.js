const nonExistentRouter = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');

nonExistentRouter.all('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

module.exports = nonExistentRouter;
