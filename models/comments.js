const db = require("../db/connection.js");

exports.postComment = (id, payload) => {
    return db.query(`
    INSERT INTO comments (body, review_id, author, votes)
    VALUES ($1, $2, $3, 0)
    RETURNING *`, [payload.body, id, payload.username])
    .then((result) => result.rows[0])
    .catch(err => err)
}