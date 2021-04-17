const { storySchema, commentSchema, userSchema } = require("./schemas.js");
const ExpressError = require("./utils/ExpressError");
const Story = require("./models/story");
const Comment = require("./models/comment");
const User = require("./models/user");

module.exports.validateStory = (req, res, next) => {
    const { error } = storySchema.validate(req.body);
    if (error) {
        const msg = error.details
            .map(
                (el) =>
                    // so error contains context, message, path and type.
                    el.message
            )
            .join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};
module.exports.validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body);
    if (error) {
        const msg = error.details
            .map(
                (el) =>
                    // so error contains context, message, path and type.
                    el.message
            )
            .join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //storing the users requested url and redirecting them back to original url which they requested after logingin or signup.
        // console.log(req.path, req.originalUrl);
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be signed in");
        return res.redirect('/login');
    }
    next();

}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const foundStory = await Story.findById(id);
    if (!foundStory.author.equals(req.user._id)) {
        req.flash("error", "you don't have permission to do that!");
        return res.redirect(`/story/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, commentId } = req.params;
    const foundComment = await Comment.findById(commentId);
    if (!foundComment.author.equals(req.user._id)) {
        req.flash("error", "you don't have permission to do that!");
        return res.redirect(`/story/${id}`);
    }
    next();
}


module.exports.validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        const msg = error.details
            .map(
                (el) =>
                    // so error contains context, message, path and type.
                    el.message
            )
            .join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};
