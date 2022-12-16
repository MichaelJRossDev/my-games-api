const express = require('express');
const app = express();
const { sendReviews } = require('./controllers/reviews');
const { sendCategories } = require('./controllers/categories');
const { receiveComment, sendCommentsByReviewId } = require('./controllers/comments');

app.use(express.json());

app.get('/api/categories', sendCategories);

app.get('/api/reviews', sendReviews);

app.get('/api/reviews/:review_id/comments', sendCommentsByReviewId);

app.post('/api/reviews/:review_id/comments', receiveComment);

module.exports = app;