const db = require("../db/connection.js");


exports.selectCommentsByReviewId = (id) => {
    return db.query(`
    SELECT * FROM comments 
    WHERE review_id = $1
    ORDER BY created_at DESC`, [id]).then((result) => result.rows)
    .catch(err => err);
}

exports.postComment = (id, payload) => {
    return db.query(`
    INSERT INTO comments (body, review_id, author, votes)
    VALUES ($1, $2, $3, 0)
    RETURNING *`, [payload.body, id, payload.username])
    .then((result) => result.rows[0])
    .catch(err => err)
}