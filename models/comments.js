const db = require("../db/connection.js");

exports.postComment = (id, payload) => {
    console.log(id);
    console.log(payload);
}