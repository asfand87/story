const Joi = require("joi");
module.exports.storySchema = Joi.object({
    story: Joi.object({
        title: Joi.string().required(),
        image: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string(),
    }).required(),
});

module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        comment: Joi.string().required(),
    }).required(),
})