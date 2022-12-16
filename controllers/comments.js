const { postComment } = require('../models/comments');

exports.receiveComment = (req, res) => {
    postComment(req.params.review_id, req.body)
    res.sendStatus(201)
}