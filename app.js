const express = require('express');
const app = express();
const { sendReviews } = require('./controllers/reviews');
const { sendCategories } = require('./controllers/categories');
const { sendCommentsByReviewId } = require('./controllers/comments')

app.get('/api/categories', sendCategories);

app.get('/api/reviews', sendReviews);

app.get('/api/reviews/:review_id/comments', sendCommentsByReviewId)

module.exports = app;