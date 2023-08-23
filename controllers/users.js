const mongoose = require('mongoose');
const User = require('../models/user');

const NOT_FOUND_ERROR = 404;
const BAD_REQUEST_ERROR = 400;
const CREATED_STATUS = 201;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      console.error(err);
      res.send({ message: 'На сервере произошла ошибка' });
    });
};

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные пользователя.' });
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NOT_FOUND_ERROR).send({ message: `Пользователь с указанным _id:${req.params.userId} не найден.` });
      }
      return res.send({ message: 'На сервере произошла ошибка' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(CREATED_STATUS).send(user))
    .catch((err) => {
      console.error(err);
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      return res.send({ message: 'На сервере произошла ошибка' });
    });
};

const updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NOT_FOUND_ERROR).send({ message: `Пользователь с указанным _id:${req.params.userId} не найден.` });
      }
      return res.send({ message: 'На сервере произошла ошибка' });
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NOT_FOUND_ERROR).send({ message: `Пользователь с указанным _id:${req.params.userId} не найден.` });
      }
      return res.send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
