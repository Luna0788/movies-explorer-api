const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema();

module.exports = mongoose.model('user', movieSchema);
