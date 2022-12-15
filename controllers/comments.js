const { selectCommentsByReviewId } = require('../models/comments');

exports.sendCommentsByReviewId = (req, res) => {
    const id = req.params.review_id;
    selectCommentsByReviewId(id).then((comments) => res.status(200).send({ comments }));
}