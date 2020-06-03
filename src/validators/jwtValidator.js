// Validação de token
const verificarToken = require("../utils/verificaToken");

// Custom validator
const validarToken = (value, helpers) => {
    const validacao = verificarToken(value);
    if(!validacao.autenticacao) {
        return helpers.error("any.invalid");
    }

    return value;
}

module.exports = validarToken;