const { celebrate, Joi, Segments } = require("celebrate");
const Validator = require("../Validator");
const validarToken = require("../jwtValidator");

module.exports = celebrate({
    [Segments.HEADERS]: Joi.object({
        "x-access-token": Joi.string().required().custom(validarToken).error(Validator.token)
    }).unknown(),
    [Segments.BODY]: Joi.object().keys({
        idLojista: Joi.string().length(24).required().error(Validator.idLojista),
        nome: Joi.string().min(3).max(30).required().error(Validator.nomeItem),
        descricao: Joi.string().min(10).max(100).required().error(Validator.descricaoItem),
        preco: Joi.number().greater(0).required().error(Validator.precoItem)
    })
});