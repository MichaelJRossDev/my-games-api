// app.js
const express = require('express');
const app = express();

const { sendReviews } = require('./controllers/reviews');

app.get('/api/reviews', sendReviews);

module.exports = app;