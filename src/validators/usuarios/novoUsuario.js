const { celebrate, Joi, Segments } = require("celebrate");
const Validator = require("../Validator");

module.exports = celebrate({
    [Segments.HEADERS]: Joi.object({
        autorizacao: Joi.string().valid(Validator.getToken()).required().error(Validator.token)
    }).unknown(),
    [Segments.BODY]: Joi.object().keys({
        email: Joi.string().email().required().error(Validator.email),
        senha: Joi.string().min(3).max(20).required().error(Validator.senha)
    })
});