const userRouter = require('express').Router();
const { validationUpdateUser } = require('../middlewares/validation');
const {
  getCurrentUser,
  updateUser,
} = require('../controllers/users');

userRouter.get('/me', getCurrentUser);

userRouter.patch('/me', validationUpdateUser, updateUser);

module.exports = userRouter;
