const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    comment: {
        type: String,
    },
    author: {
        type: String,
    }

});





module.exports = mongoose.model("Comment", commentSchema);