const { JWT_SECRET } = process.env;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const DEFAULT_ERROR = 500;
const NOT_FOUND_ERROR = 404;
const UNAUTHORIZED_ERROR = 401;
const BAD_REQUEST_ERROR = 400;
const CREATED_STATUS = 201;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(DEFAULT_ERROR).send({ message: 'На сервере произошла ошибка' });
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
      return res.status(DEFAULT_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(CREATED_STATUS).send(user))
    .catch((err) => {
      console.error(err);
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const updateUser = (req, res, data) => {
  User.findByIdAndUpdate(req.user._id, data, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные' });
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NOT_FOUND_ERROR).send({ message: `Пользователь с указанным _id:${req.params.userId} не найден.` });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  updateUser(req, res, { name, about });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  updateUser(req, res, { avatar });
};

const login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .send(('Аутентификация успешно выполнена'));
    })
    .catch((err) => {
      res.status(UNAUTHORIZED_ERROR).send({ message: err.message });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUserProfile,
  updateUserAvatar,
  login,
};
