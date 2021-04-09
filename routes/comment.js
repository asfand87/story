const express = require("express");
const router = express.Router({ mergeParams: true });
const Story = require("../models/story");
const Comment = require("../models/comment");
const { validateComment, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const catchAsync = require("../utils/catchAsync");



router.post("/", isLoggedIn, validateComment, catchAsync(async (req, res, next) => {

    const { id } = req.params;
    const foundStory = await Story.findById(id);
    const comment = new Comment(req.body.comment);
    comment.author = req.user._id;
    foundStory.comments.push(comment);
    await foundStory.save();
    await comment.save();
    res.redirect(`/story/${id}`);
}))

router.get("/:commentId/edit", isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, commentId } = req.params;
    const story = await Story.findById(id);
    const comment = await Comment.findById(commentId);
    res.render("comments/edit", { story, comment });
}))

router.put("/:commentId", isLoggedIn, validateComment, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, commentId } = req.params;
    console.log(id);
    const { comment } = req.body;
    const updatedComment = await Comment.findByIdAndUpdate(commentId, comment, {
        new: true,
    });
    await updatedComment.save();

    req.flash("success", "Successfully updated comment");
    res.redirect(`/story/${id}`);
}))

router.delete("/:commentId", isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, commentId } = req.params;
    await Story.findByIdAndUpdate(id, {
        $pull: { comments: commentId }
    })
    await Comment.findByIdAndDelete(commentId);

    req.flash("success", "Successfully deleted Comment");
    res.redirect(`/story/${id}`)
}))

module.exports = router;