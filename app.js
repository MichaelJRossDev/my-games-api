const express = require('express');
const app = express();
const { sendReviews, sendReviewById, alterReview } = require('./controllers/reviews');
const { sendCategories } = require('./controllers/categories');
const { receiveComment, sendCommentsByReviewId } = require('./controllers/comments');
const cors = require('cors');

app.use(cors());

app.use(express.json());

app.get('/api/categories', sendCategories);

app.get('/api/reviews', sendReviews);

app.get('/api/reviews/:review_id', sendReviewById);

app.get('/api/reviews/:review_id/comments', sendCommentsByReviewId);

app.post('/api/reviews/:review_id/comments', receiveComment);

app.patch('/api/reviews/:review_id', alterReview)

module.exports = app;