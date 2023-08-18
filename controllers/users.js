const User = require('../models/user');

const DEFAULT_ERROR = 500;
const NOT_FOUND_ERROR = 404;
const BAD_REQUEST_ERROR = 400;

const updateOptions = {
  new: true,
  runValidators: true,
  upsert: true,
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (users.length === 0) {
        return res.status(NOT_FOUND_ERROR).send({ message: 'Пользователи не найдены.' });
      }
      return res.send(users);
    })
    .catch((err) => res.status(DEFAULT_ERROR).send({ message: err.message }));
};

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_ERROR).send({ message: `Пользователь с указанным _id:${req.params.userId} не найден.` });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные пользователя.' });
      }
      return res.status(DEFAULT_ERROR).send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      return res.status(DEFAULT_ERROR).send({ message: err.message });
    });
};

const updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, updateOptions)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_ERROR).send({ message: `Пользователь с указанным _id:${req.params.userId} не найден.` });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      return res.status(DEFAULT_ERROR).send({ message: err.message });
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, updateOptions)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_ERROR).send({ message: `Пользователь с указанным _id:${req.params.userId} не найден.` });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }
      return res.status(DEFAULT_ERROR).send({ message: err.message });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
