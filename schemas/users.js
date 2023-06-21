const Joi = require('joi');

const { userRegexp } = require('../constants/user');

const userRegisterSchema = Joi.object({
    name: Joi.string().required().messages({
        "any.required": `"missing required name field"`,
    }),
    email: Joi.string().pattern(userRegexp).required().message({
        "any.required": `"missing required email field"`,
    }),
    password: Joi.string().min(6).required(),
});

const userLoginSchema = Joi.object({
    email: Joi.string().pattern(userRegexp).required().message({
        "any.required": `"missing required email field"`,
    }),
    password: Joi.string().min(6).required(),
});


module.exports = {
    userRegisterSchema,
    userLoginSchema,
}