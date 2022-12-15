const express = require('express');
const app = express();
const { sendReviews, sendReviewById } = require('./controllers/reviews');
const { sendCategories } = require('./controllers/categories');

app.get('/api/categories', sendCategories);

app.get('/api/reviews', sendReviews);

app.get('/api/reviews/:review_id', sendReviewById);

module.exports = app;