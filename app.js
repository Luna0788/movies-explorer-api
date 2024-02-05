const express = require('express');
const mongoose = require('mongoose');
const NotFoundError = require('./errors/NotFoundError');
const router = require('./routes');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;
const app = express();

mongoose.connect(DB_URL);

// app.use(auth);
app.use(router);

app.use('/', (req, res, next) => {
  next(new NotFoundError('Такой страницы не существует'));
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
