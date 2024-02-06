const { celebrate, Joi } = require('celebrate');

module.exports.validationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.validationCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.validationUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

module.exports.validationCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,8})([/\w .-]*)*\/?$/).required(),
    trailer: Joi.string().required().pattern(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,8})([/\w .-]*)*\/?$/).required(),
    thumbnail: Joi.string().required().pattern(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,8})([/\w .-]*)*\/?$/).required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

module.exports.validationMovieId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});
