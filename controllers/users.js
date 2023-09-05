const { JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');

const CREATED_STATUS = 201;

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

const findUserById = (req, res, id, next) => {
  User.findById(id)
    .orFail(() => {
      throw new NotFoundError('Пользователь с указанным id не найден.');
    })
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  findUserById(req, res, req.params.userId, next);
};

const getCurrentUser = (req, res, next) => {
  findUserById(req, res, req.user._id, next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      const userData = {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      };
      res.status(CREATED_STATUS).send(userData);
    })
    .catch(next);
};

const updateUser = (req, res, data, next) => {
  User.findByIdAndUpdate(req.user._id, data, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError('Пользователь с указанным id не найден.');
    })
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

const updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  updateUser(req, res, { name, about }, next);
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  updateUser(req, res, { avatar }, next);
};

const login = (req, res, next) => {
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
    .catch(next);
};

module.exports = {
  getUsers,
  getUser,
  getCurrentUser,
  createUser,
  updateUserProfile,
  updateUserAvatar,
  login,
};
