const { celebrate, Joi, Segments } = require("celebrate");
const Validator = require("../Validator");
const validarToken = require("../jwtValidator");

module.exports = celebrate({
    [Segments.HEADERS]: Joi.object({
        "x-access-token": Joi.string().required().custom(validarToken).error(Validator.token)
    }).unknown(),
    [Segments.PARAMS]: Joi.object().keys({
        idCliente: Joi.string().length(24).required().error(Validator.idCliente)
    })
});