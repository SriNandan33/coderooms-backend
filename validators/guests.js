const { request } = require('express')

const { Joi } = require('express-validation')

const addGuestValidator = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
}

module.exports = {
  addGuestValidator,
}
