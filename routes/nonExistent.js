const nonExistentRouter = require('express').Router();

const NOT_FOUND_ERROR = 404;

nonExistentRouter.all('*', (req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: 'Ресурс не найден' });
});

module.exports = nonExistentRouter;
