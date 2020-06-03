const { celebrate, Joi, Segments } = require("celebrate");
const Validator = require("../Validator");

module.exports = celebrate({
    [Segments.HEADERS]: Joi.object({
        autorizacao: Joi.string().valid(Validator.getToken()).required().error(Validator.token)
    }).unknown()
});