// Configurações de conexão
const { ObjectId } = require("mongodb");
const Config = require("../database/Config");
const MongoDB = require("../database/MongoDB");

// Auxiliares
const Response = require("../utils/Response");

module.exports = {

    async adicionar(request, response) {
        // Recupera informações do corpo da requisição
        const { nome, descricao } = request.body;
        const novoSetor = { nome, descricao, dataCriacao: (new Date()).toISOString() };

        // Cria variáveis de resposta, conexão e gerenciamento
        const res = new Response();
        const cliente = Config.getConexao();
        const mongo = new MongoDB(cliente);

        try {
            // Inicia conexão
            await mongo.conectar();

            // Envia para o banco
            const resAdd = await mongo.adicionar(Config.getColecaoSetores(), novoSetor);
            const id = resAdd.insertedId;

            // Organiza a resposta
            res.status(200);
            res.add("message", "Adição realizada com sucesso");
            res.add("idSetor", id);

            // Fecha conexão
            mongo.fechar();
        } catch(erro) {
            mongo.fechar();
            res.add("message", `Erro de conexão: ${erro.message}`);
        }

        return response.json(res.get());
    },

    async listar(request, response) {
        // Cria variáveis de resposta, conexão e gerenciamento
        const res = new Response();
        const cliente = Config.getConexao();
        const mongo = new MongoDB(cliente);

        try {
            // Inicia conexão
            await mongo.conectar();

            // Envia para o banco
            const dados = await mongo.buscar(Config.getColecaoSetores(), {});

            // Organiza a resposta
            res.status(200);
            res.add("message", "Busca realizada com sucesso");
            res.add("data", dados);

            // Fecha conexão
            mongo.fechar();
        } catch(erro) {
            mongo.fechar();
            res.add("message", `Erro de conexão: ${erro.message}`);
        }

        return response.json(res.get());
    }

};