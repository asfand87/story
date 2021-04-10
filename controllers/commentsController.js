const Story = require("../models/story");
const Comment = require("../models/comment");

module.exports.makeComment = async (req, res, next) => {
    const { id } = req.params;
    const foundStory = await Story.findById(id);
    const comment = new Comment(req.body.comment);
    comment.author = req.user._id;
    foundStory.comments.push(comment);
    await foundStory.save();
    await comment.save();
    res.redirect(`/story/${id}`);
}

module.exports.updateCommentForm = async (req, res, next) => {
    const { id, commentId } = req.params;
    const story = await Story.findById(id);
    const comment = await Comment.findById(commentId);
    res.render("comments/edit", { story, comment });
};

module.exports.updateComment = async (req, res, next) => {
    const { id, commentId } = req.params;
    // console.log(id);
    const { comment } = req.body;
    const updatedComment = await Comment.findByIdAndUpdate(commentId, comment, {
        new: true,
    });
    await updatedComment.save();

    req.flash("success", "Successfully updated comment");
    res.redirect(`/story/${id}`);
};

module.exports.deleteComment = async (req, res, next) => {
    const { id, commentId } = req.params;
    await Story.findByIdAndUpdate(id, {
        $pull: { comments: commentId }
    })
    await Comment.findByIdAndDelete(commentId);

    req.flash("success", "Successfully deleted Comment");
    res.redirect(`/story/${id}`)
};