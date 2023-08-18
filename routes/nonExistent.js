const nonExistentRouter = require('express').Router();

nonExistentRouter.all('*', (req, res) => {
  res.status(404).send({ message: 'Ресурс не найден' });
});

module.exports = nonExistentRouter;
