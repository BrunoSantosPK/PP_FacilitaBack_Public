const { celebrate, Joi, Segments } = require("celebrate");
const Validator = require("../Validator");

module.exports = celebrate({
    [Segments.HEADERS]: Joi.object({
        autorizacao: Joi.string().valid(Validator.getToken()).required().error(Validator.token)
    }).unknown(),
    [Segments.BODY]: Joi.object().keys({
        nome: Joi.string().min(5).max(20).required().error(Validator.nomeSetor),
        descricao: Joi.string().min(10).max(100).required().error(Validator.descricaoSetor)
    })
});