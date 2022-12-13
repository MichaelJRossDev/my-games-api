const { selectReviews } = require('../models/reviews');

exports.sendReviews = (req, res) => {
    selectReviews().then((reviews) => res.status(200).send({ reviews }));
};