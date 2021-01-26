// validators for register, login endpoints

const { Joi } = require('express-validation')

const loginValidator = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
  }),
}

const registerValidator = {
  body: Joi.object({
    name: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
  }),
}

const ForgotPasswordValidator = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
}

const ResetPasswordValidator = {
  body: Joi.object({
    password: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
    confirmPassword: Joi.ref('password'),
  }).with('password', 'confirmPassword'),
}

module.exports = {
  loginValidator,
  registerValidator,
  ForgotPasswordValidator,
  ResetPasswordValidator,
}
