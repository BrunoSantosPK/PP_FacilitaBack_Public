// Auxiliares
const Response = require("../utils/Response");

module.exports = {

    getNovidades(request, response) {
        // Cria variáveis de resposta
        const res = new Response();

        // Configura a resposta
        res.status(200);
        res.add("novidade", "Aproveite o Facilita de cara nova. A versão mais recente é a 1.0.0, então verifique na Play Store se você já pode atualizar.");
        return response.json(res.get());
    }

};