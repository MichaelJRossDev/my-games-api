const { reduce } = require('../db/data/test-data/categories');
const { selectCategories } = require('../models/categories');

exports.sendCategories = (req, res) => {
    selectCategories().then((categories) => res.status(200).send({ categories }))
    .catch((err) => res.sendStatus(500));
};