const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Некорректный email',
    },
    required: [true, 'Поле "email" должно быть заполнено'],
    unique: true,
  },
  password: {
    select: false,
    type: String,
    required: [true, 'Поле "password" должно быть заполнено'],
  },
  name: {
    type: String,
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        // return Promise.reject(new AuthError('Неправильные почта или пароль'));
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            // return Promise.reject(new AuthError('Неправильные почта или пароль'));
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          const {
            _id, name, about, avatar,
          } = user;
          return {
            _id, name, about, avatar, email,
          };
        });
    });
};

module.exports = mongoose.model('user', userSchema);
