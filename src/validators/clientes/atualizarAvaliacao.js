const { celebrate, Joi, Segments } = require("celebrate");
const Validator = require("../Validator");
const validarToken = require("../jwtValidator");

module.exports = celebrate({
    [Segments.HEADERS]: Joi.object({
        "x-access-token": Joi.string().required().custom(validarToken).error(Validator.token)
    }).unknown(),
    [Segments.BODY]: Joi.object().keys({
        idAvaliacao: Joi.string().length(24).required().error(Validator.idAvaliacao),
        classificacao: Joi.number().min(1).max(5).required().error(Validator.classificacao),
        detalhes: Joi.string().min(10).max(100).required().error(Validator.detalhes)
    })
});