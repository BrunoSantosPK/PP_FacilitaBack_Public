const jwt = require("jsonwebtoken");

function verificaToken(token) {
    return jwt.verify(token, process.env.SECRET, (error, decoded) => {
        if(error) {
            return {
                autenticacao: false,
                id: -1
            };
        }

        return {
            autenticacao: true,
            id: decoded.id
        };
    });
}

module.exports = verificaToken;