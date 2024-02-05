const User = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');

// get current user
module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(new NotFoundError('Текущий пользователь не найден.'))
    .then((user) => res.send(user))
    .catch((err) => next(err));
};

// update user info
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true, upsert: false })
    .orFail(new NotFoundError('Пользователь по указанному _id не найден.'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Некорректный id пользователя'));
      }
      return next(err);
    });
};
