// app.js
const express = require('express');
const app = express();
const { sendCategories } = require('./controllers/categories');

app.get('/api/categories', sendCategories);

module.exports = app;