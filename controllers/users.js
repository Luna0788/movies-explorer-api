const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { CREATED_CODE } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;
const User = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');

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
  const { name, email } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { name, email }, { new: true, runValidators: true, upsert: false })
    .orFail(new NotFoundError('Пользователь по указанному _id не найден.'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Некорректный id пользователя'));
      }
      return next(err);
    });
};

// login
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
        { expiresIn: '7d' },
      );
      res.cookie('token', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: 'None',
        secure: true,
      })
        .send(user);
    })
    .catch(next);
};

// create user / signup
module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10).then((hash) => User.create({
    name,
    email,
    password: hash,
  }))
    .then(() => res.status(CREATED_CODE).send({
      name, email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с таким email уже существует'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Некорректные данные пользователя'));
      }
      return next(err);
    });
};

// logout
module.exports.logout = (req, res) => {
  res.clearCookie('token').send({ message: 'Выход' });
};
