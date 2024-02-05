const movieRouter = require('express').Router();

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

movieRouter.get('/', getMovies);
movieRouter.post('/', createMovie);
movieRouter.delete('/:movieId', deleteMovie);

module.exports = movieRouter;
