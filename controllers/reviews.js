const { lastIndexOf } = require('../db/data/test-data/categories');
const { selectReviews, selectReviewById } = require('../models/reviews');

exports.sendReviews = (req, res) => {
    selectReviews().then((reviews) => res.status(200).send({ reviews }));
};

exports.sendReviewById = (req, res) => {
    const id = req.params.review_id;
    if (/^\d+$/.test(id)) {

        selectReviewById(req.params.review_id)
        .then(review => {
            if (review) res.status(200).send({ review });
            else res.sendStatus(404);
        })
        .catch((err) => res.sendStatus(500));
        
    } else {
        
        res.sendStatus(400);

    }
    
}