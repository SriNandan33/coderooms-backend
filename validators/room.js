// validators for rooms api

const { Joi } = require('express-validation')

const roomValidator = {
  body: Joi.object({
    id: Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$')),
    name: Joi.string(),
    owner: Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$')),
    code: Joi.string().allow(''),
    guests: Joi.array(),
    language: Joi.string().valid('python', 'javascript'),
    private: Joi.bool(),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
  }),
}

module.exports = {
  roomValidator,
}
