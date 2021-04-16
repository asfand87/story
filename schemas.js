const Joi = require("joi");
module.exports.storySchema = Joi.object({
    story: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string(),
    }).required(),
});

module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        comment: Joi.string().required(),
    }).required(),
})
module.exports.paswwordSchema = Joi.object({
    username: Joi.string().alphanum().min(3).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).min(6).required(),
    password: Joi.string().min(6).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
})

