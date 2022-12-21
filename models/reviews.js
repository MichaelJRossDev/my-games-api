const db = require("../db/connection.js");

exports.selectReviews = () => {
  return db.query(`
  SELECT reviews.*,
  CAST((SELECT COUNT(*) FROM comments WHERE comments.review_id = reviews.review_id) AS INT)
    AS comment_count FROM reviews
  ORDER BY created_at DESC`)
  .then((result) => {
    return result.rows
  })
};

exports.selectReviewById = (id) => {
  return db.query(`
  SELECT * FROM reviews
  WHERE review_id = $1`, [id])
  .then((result) => {
    if (result.rows.length === 0) {
      return 0;
    }
    return result.rows[0];
  })
  .catch(() => {
    return -1;
  })
}

exports.patchReview = (id, changes) => {
  return db.query(`
  UPDATE Reviews
  SET votes = votes + $1
  WHERE review_id = $2
  RETURNING *`, [changes.inc_votes, id])
  .then((output) => output.rows && output.rows.length > 0 ? output : {code : 'review not found'})
  .catch(err => err)
}