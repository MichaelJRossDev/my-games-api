const { lastIndexOf } = require('../db/data/test-data/categories');
const { selectReviews, selectReviewById, patchReview } = require('../models/reviews');

exports.sendReviews = (req, res) => {
    selectReviews().then((reviews) => res.status(200).send({ reviews }));
};

exports.sendReviewById = (req, res) => {
    const id = req.params.review_id;

    selectReviewById(id)
    .then(review => {
        switch (review) {
            case -1: //Invalid id
                res.sendStatus(400)
                break;
            
            case 0: //Valid id but does not exist in database
                res.sendStatus(404);
                break;
        
            default: //Valid id and found
                res.status(200).send({ review });
                break;
        }
    })
    .catch((err) => res.sendStatus(500));
}
        
exports.alterReview = (req, res) => {
    const id = req.params.review_id
    const changes = req.body
    patchReview(id, changes).then((response) => {
        if (response.code) {
            switch (response.code) {
                case '23502':
                    res.status(400).send(response)
                    break;
                
                case 'review not found':
                    res.status(404).send({msg : `No such review ID: ${id}`})
                    break;

                case '22P02':
                    res.status(400).send(response)
                    break;

                default:
                    res.sendStatus(500);
                    break;
            }
        } else {
            res.status(200).send(response);
        }
        
    })
}