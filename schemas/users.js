const Joi = require('joi');

const { userRegexp, subscriptionList } = require('../constants/user');

const userRegisterSchema = Joi.object({
    email: Joi.string().pattern(userRegexp).required().messages({
        "any.required": `"missing required email field"`,
    }),
    password: Joi.string().min(6).required().messages({
        'any.required': 'missing required password field',
    }),
    subscription: Joi.string().valid(...subscriptionList),
    token: Joi.string(),
    avatarURL: Joi.string(),
});

const userLoginSchema = Joi.object({
    email: Joi.string().pattern(userRegexp).required().messages({
        "any.required": `"missing required email field"`,
    }),
    password: Joi.string().min(6).required(),
});

const  subscriptionUpdateSchema = Joi.object({
    subscription: Joi.string()
      .valid(...subscriptionList)
      .required()
      .messages({
        'any.required': 'missing required subscription field',
      }),
  });


module.exports = {
    userRegisterSchema,
    userLoginSchema,
    subscriptionUpdateSchema,
}