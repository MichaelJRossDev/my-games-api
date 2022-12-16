
const { selectCommentsByReviewId, postComment } = require('../models/comments');

exports.sendCommentsByReviewId = (req, res) => {

    const id = req.params.review_id;
    selectCommentsByReviewId(id).then((comments) => {

        if (comments.code) {
            switch (comments.code) {
                case '23503':
                    res.status(404).send(comments);
                    break;
                
                case '22P02':
                    res.status(400).send(comments);
                    break;

                case '23502':
                    res.status(400).send(comments);



                    break;

                default:
                    res.sendStatus(500);
                    break;
            } 
        } else {
            res.status(200).send({ comments });
        }    
  });
}

exports.receiveComment = (req, res) => {
    postComment(req.params.review_id, req.body).then((comment) => {
        if (comment.code) {
            switch (comment.code) {
                case '23503':
                    res.status(404).send(comment);
                    break;
                
                case '22P02':
                    res.status(400).send(comment);
                    break;

                case '23502':
                    res.status(400).send(comment);
            }
        } else {
            res.status(201).send( {comment} );
        }
        
    })
}