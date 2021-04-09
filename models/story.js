const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const Comment = require("../models/comment");
const storySchema = new Schema({
    title: String,
    image: String,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment",
        }
    ]

});

storySchema.pre("findOneAndDelete", async function (doc) {
    // if some thing was found. in our case we are looking for reviews.
    if (doc) {
        await Comment.deleteMany({
            // so here we are saying that look in Review and remove where id is some where
            _id: {
                $in: doc.comments,
            },
        });
    }
});


module.exports = mongoose.model("Story", storySchema);