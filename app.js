const express = require('express');
const app = express();
const { sendReviews } = require('./controllers/reviews');
const { sendCategories } = require('./controllers/categories');

app.get('/api/categories', sendCategories);

app.get('/api/reviews', sendReviews);

module.exports = app;