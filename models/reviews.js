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