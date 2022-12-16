const express = require('express');
const app = express();
const { sendReviews } = require('./controllers/reviews');
const { sendCategories } = require('./controllers/categories');
const { sendCommentsByReviewId, receiveComment } = require('./controllers/comments');

app.use(express.json());

app.get('/api/categories', sendCategories);

app.get('/api/reviews', sendReviews);

app.post('/api/reviews/:review_id/comments', receiveComment)

module.exports = app;