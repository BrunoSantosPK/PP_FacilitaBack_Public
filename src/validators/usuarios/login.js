const { celebrate, Joi, Segments } = require("celebrate");
const Validator = require("../Validator");
const validarToken = require("../jwtValidator");

module.exports = celebrate({
    [Segments.BODY]: Joi.object().keys({
        email: Joi.string().email().required().error(Validator.email),
        senha: Joi.string().min(3).max(20).required().error(Validator.senha)
    })
});