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
        rating: Joi.number().min(1).max(5).required(),
    }).required(),
})


module.exports.userSchema = Joi.object({
    username: Joi.string().alphanum().min(3).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).min(6).required(),
    password: Joi.string()
        .min(8)
        .regex(/^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,30}$/)
        .required()
        .label("Password")
        .messages({
            "string.min": "Must have at least 8 characters",
            "object.regex": "Must have at least 8 characters",
            "string.pattern.base": "Must be 8 characters long, must have one upperCase, one lowerCase and one special character and can no longer than 30 characters"
        }),

})

