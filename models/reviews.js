const db = require("../db/connection.js");

exports.selectReviews = () => {
  return db.query(`
  SELECT * FROM reviews
  ORDER BY created_at DESC;`).then((result) => result.rows);
};