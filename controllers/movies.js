const Movie = require('../models/movie');
const {
  CREATED_CODE,
} = require('../utils/constants');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

// find and return all movies by current user
module.exports.getMovies = (req, res, next) => {
  const userId = req.user._id;

  Movie.find({ owner: userId })
    .then((movies) => res.send(movies))
    .catch(next);
};

// create movie
module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.status(CREATED_CODE).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Некорректные данные при создании фильма'));
      }
      return next(err);
    });
};

// delete movie by id
module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;

  Movie.findById(movieId)
    .orFail(new NotFoundError('Фильм с указанным _id не найден.'))
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        return next(new ForbiddenError('Невозможно удалить чужой фильм'));
      }
      return movie.deleteOne()
        .then(() => res.send({ message: 'Фильм удален' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Некорректный id фильма'));
      }
      return next(err);
    });
};
