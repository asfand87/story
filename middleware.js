const { storySchema, commentSchema } = require("./schemas.js");
const ExpressError = require("./utils/ExpressError");

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