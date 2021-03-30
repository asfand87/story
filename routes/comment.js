const express = require("express");
const router = express.Router({ mergeParams: true });
const Story = require("../models/story");
const Comment = require("../models/comment");
const { validateComment } = require("../middleware.js");
const catchAsync = require("../utils/catchAsync");



router.post("/", validateComment, catchAsync(async (req, res, next) => {

    const { id } = req.params;
    const foundStory = await Story.findById(id);
    const comment = new Comment(req.body.comment);
    foundStory.comments.push(comment);
    await foundStory.save();
    await comment.save();
    res.redirect(`/story/${id}`);
}))

router.get("/:commentId/edit", catchAsync(async (req, res) => {
    const { id, commentId } = req.params;
    const story = await Story.findById(id);
    const comment = await Comment.findById(commentId);
    res.render("comments/edit", { story, comment });
}))

router.put("/:commentId", validateComment, catchAsync(async (req, res) => {
    const { id, commentId } = req.params;
    console.log(id);
    const { comment } = req.body;
    const updatedComment = await Comment.findByIdAndUpdate(commentId, comment, {
        new: true,
    });
    await updatedComment.save();
    res.redirect(`/story/${id}`);
}))

router.delete("/:commentId", catchAsync(async (req, res) => {
    const { id, commentId } = req.params;
    await Story.findByIdAndUpdate(id, {
        $pull: { comments: commentId }
    })
    await Comment.findByIdAndDelete(commentId);
    res.redirect(`/story/${id}`)
}))

module.exports = router;