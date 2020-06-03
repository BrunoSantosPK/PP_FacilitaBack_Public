const { celebrate, Joi, Segments } = require("celebrate");
const Validator = require("../Validator");
const validarToken = require("../jwtValidator");

module.exports = celebrate({
    [Segments.HEADERS]: Joi.object({
        "x-access-token": Joi.string().required().custom(validarToken).error(Validator.token)
    }).unknown(),
    [Segments.BODY]: Joi.object().keys({
        idCliente: Joi.string().length(24).required().error(Validator.idCliente),
        nome: Joi.string().min(3).max(100).required().error(Validator.nomePerfil),
        endereco: Joi.string().max(50).required().error(Validator.endereco),
        cidade: Joi.string().max(50).required().error(Validator.cidade),
        uf: Joi.string().length(2).required().error(Validator.uf),
        whatsapp: Joi.string().min(10).max(11).required().error(Validator.zap),
        pais: Joi.string().max(50).required().error(Validator.pais)
    })
});