const { postComment } = require('../models/comments');

exports.receiveComment = (req, res) => {
    postComment(req.params.review_id, req.body).then(comment => {
        res.status(201).send( {comment} );
    })
}