const movieRouter = require('express').Router();
const { validationCreateMovie, validationMovieId } = require('../middlewares/validation');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

movieRouter.get('/', getMovies);
movieRouter.post('/', validationCreateMovie, createMovie);
movieRouter.delete('/:movieId', validationMovieId, deleteMovie);

module.exports = movieRouter;
