const { celebrate, Joi, Segments } = require("celebrate");
const Validator = require("../Validator");
const validarToken = require("../jwtValidator");

module.exports = celebrate({
    [Segments.HEADERS]: Joi.object({
        "x-access-token": Joi.string().required().custom(validarToken).error(Validator.token)
    }).unknown(),
    [Segments.BODY]: Joi.object().keys({
        pais: Joi.string().max(50).required().error(Validator.pais),
        uf: Joi.string().length(2).required().error(Validator.uf),
        cidade: Joi.string().max(50).required().error(Validator.cidade),
        idSetor: Joi.string().length(24).required().error(Validator.idSetor),
        idCliente: Joi.string().length(24).required().error(Validator.idCliente)
    })
});