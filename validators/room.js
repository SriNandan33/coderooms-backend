// validators for rooms api

const { Joi } = require('express-validation')

const roomValidator = {
  body: Joi.object({
    name: Joi.string(),
    owner: Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$')),
    code: Joi.string(),
    private: Joi.bool(),
  }),
}

module.exports = {
  roomValidator,
}
