const usersRouter = require('express').Router();
const {
  getUsers, getUser, getCurrentUser, updateUserProfile, updateUserAvatar,
} = require('../controllers/users');

usersRouter.get('/', getUsers);
usersRouter.get('/:userId', getUser);
usersRouter.get('/users/me', getCurrentUser);
usersRouter.patch('/me', updateUserProfile);
usersRouter.patch('/me/avatar', updateUserAvatar);

module.exports = usersRouter;
