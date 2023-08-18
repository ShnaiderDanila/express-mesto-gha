const User = require('../models/user');

const VALIDATION_ERROR_CODE = 400;
const CAST_ERROR_CODE = 404;
const DEFAULT_ERROR_CODE = 500;

const updateOptions = {
  new: true,
  runValidators: true,
  upsert: true,
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(CAST_ERROR_CODE).send({ message: 'Пользователи не найдены.' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: err.message });
    });
};

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(CAST_ERROR_CODE).send({ message: `Пользователь с указанным _id:${req.params.userId} не найден.` });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: err.message });
    });
};

const updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, updateOptions)
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      if (err.name === 'CastError') {
        return res.status(CAST_ERROR_CODE).send({ message: `Пользователь c указанным _id:${req.user._id} не найден.` });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: err.message });
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, updateOptions)
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }
      if (err.name === 'CastError') {
        return res.status(CAST_ERROR_CODE).send({ message: `Пользователь c указанным _id:${req.user._id} не найден.` });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: err.message });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
