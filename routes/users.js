const router = require('express').Router();
const {
  getAllUsers, getUser, createUser, updateUserProfile, updateUserAvatar,
} = require('../controllers/users');

router.get('/', getAllUsers);
router.get('/:userId', getUser);
router.post('/', createUser);
router.patch('/me', updateUserProfile);
router.patch('/avatar', updateUserAvatar);

module.exports = router;
