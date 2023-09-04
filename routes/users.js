const usersRouter = require('express').Router();
const {
  getUsers, getUser, getCurrentUser, updateUserProfile, updateUserAvatar,
} = require('../controllers/users');

const { userIdValidation, userProfileValidation, userAvatarValidation } = require('../middlewares/validation');

usersRouter.get('/', getUsers);
usersRouter.get('/:userId', userIdValidation, getUser);
usersRouter.get('/users/me', getCurrentUser);
usersRouter.patch('/me', userProfileValidation, updateUserProfile);
usersRouter.patch('/me/avatar', userAvatarValidation, updateUserAvatar);

module.exports = usersRouter;
