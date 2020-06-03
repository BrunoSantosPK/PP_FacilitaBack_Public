// Configurações de conexão
const { ObjectId } = require("mongodb");
const Config = require("../database/Config");
const MongoDB = require("../database/MongoDB");

// Auxiliares
const Response = require("../utils/Response");
const sendFile = require("../utils/upload");
const estatisticas = require("./EstatisticasController");

// Models
const Favorito = require("../database/Favorito");
const Lojista = require("../database/Lojista");
const Avaliacao = require("../database/Avaliacao");

module.exports = {

    async getLojista(request, response) {
        // Recupera informações da requisição
        const { idLojista, idCliente } = request.body;
        const query = { _id: ObjectId(idLojista) };

        // Cria variáveis de resposta, conexão e gerenciamento
        const res = new Response();
        const cliente = Config.getConexao();
        const mongo = new MongoDB(cliente);

        try {
            // Inicia a conexão
            await mongo.conectar();

            // Busca lojista
            let lojista = await mongo.buscar(Config.getColecaoLojistas(), query);
            if(lojista.length != 0) {
                // Altera as informações de cliques
                lojista = lojista[0];
                await estatisticas.resultadoCliques(idLojista, idCliente, mongo);
            }

            // Organiza a resposta
            res.status(200);
            res.add("message", "Dados acessados com sucesso.");
            res.add("data", lojista);

            // Fecha a conexão
            mongo.fechar();
        } catch(erro) {
            mongo.fechar();
            res.add("message", `Erro de conexão: ${erro.message}`);
        }

        return response.json(res.get());
    },

    async getLojistas(request, response) {
        // Recupera informações da requisição
        const { idSetor, idCliente, cidade, pais, uf } = request.body;
        const query = { "setor.$id": ObjectId(idSetor), pais, cidade, uf };

        // Cria variáveis de resposta, conexão e gerenciamento
        const res = new Response();
        const cliente = Config.getConexao();
        const mongo = new MongoDB(cliente);

        try {
            // Inicia a conexão
            await mongo.conectar();

            // Busca dados
            const lojistas = await mongo.buscar(Config.getColecaoLojistas(), query);

            // Marca a busca do setor
            await estatisticas.resultadoBusca(idSetor, idCliente, pais, uf, cidade, mongo);

            // Organiza os resultados
            res.status(200);
            res.add("message", "Busca realizada com sucesso.");
            res.add("data", lojistas);

            // Fecha a conexão
            mongo.fechar();
        } catch(erro) {
            mongo.fechar();
            res.add("message", `Erro de conexão: ${erro.message}`);
        }

        return response.json(res.get());
    },

    async cadastrarContato(request, response) {
        // Recupera informações da requisição
        const { idLojista, idCliente } = request.body;

        // Cria variáveis de resposta, conexão e gerenciamento
        const res = new Response();
        const cliente = Config.getConexao();
        const mongo = new MongoDB(cliente);

        try {
            // Inicia a conexão
            await mongo.conectar();

            // Altera as informações de contato
            await estatisticas.resultadoContato(idLojista, idCliente, mongo);

            // Organiza a resposta
            res.status(200);
            res.add("message", "Dados acessados com sucesso.");
            res.add("idLojista", idLojista);
            res.add("idCliente", idCliente);

            // Fecha a conexão
            mongo.fechar();
        } catch(erro) {
            mongo.fechar();
            res.add("message", `Erro de conexão: ${erro.message}`);
        }

        return response.json(res.get());
    },

    async getAvaliacoes(request, response) {
        // Recupera informações da requisição
        const { idCliente } = request.params;
        const query = Avaliacao.buscar(ObjectId(idCliente));

        // Cria variáveis de resposta, conexão e gerenciamento
        const res = new Response();
        const cliente = Config.getConexao();
        const mongo = new MongoDB(cliente);

        try {
            // Inicia a conexão
            await mongo.conectar();

            // Busca as avaliações
            const avaliacoes = await mongo.buscar(Config.getColecaoRecomendacoes(), query);

            // Encontra as avaliações para cada lojista
            const list = [];
            for(let i = 0; i < avaliacoes.length; i++) {
                list.push(ObjectId(avaliacoes[i].lojista.oid));
            }
            const detalhes = await mongo.buscar(Config.getColecaoLojistas(), Lojista.findMult(list));

            for(let i = 0; i < avaliacoes.length; i++) {
                let lojista = {};
                for(let j = 0; j < detalhes.length; j++) {
                    if(detalhes[j]._id.toString() == avaliacoes[i].lojista.oid.toString()) {
                        lojista = detalhes[j];
                        break;
                    }
                }
                avaliacoes[i].lojista = lojista;
            }

            // Organiza as respostas
            res.status(200);
            res.add("message", "Busca realizada com sucesso.");
            res.add("data", avaliacoes);

            // Fecha as conexões
            mongo.fechar();
        } catch(erro) {
            mongo.fechar();
            res.add("message", `Erro de conexão: ${erro.message}`);
        }

        return response.json(res.get());
    },

    async favoritar(request, response) {
        // Recupera informações da requisição
        const { idCliente, idLojista } = request.body;
        const favorito = new Favorito(ObjectId(idCliente), ObjectId(idLojista));

        // Cria variáveis de resposta, conexão e gerenciamento
        const res = new Response();
        const cliente = Config.getConexao();
        const mongo = new MongoDB(cliente);

        try {
            // Inicia a conexão
            await mongo.conectar();

            // Verifica se já está nos favoritos
            const existe = await mongo.buscar(Config.getColecaoFavoritos(), favorito.existe());
            if(existe.length != 0) {
                res.add("message", "O lojista já está nos favoritos.");
                return response.json(res.get());
            }

            // Adiciona o favorito
            const resAdd = await mongo.adicionar(Config.getColecaoFavoritos(), favorito.novo());
            const idFavorito = resAdd.insertedId;

            // Organiza a resposta
            res.status(200);
            res.add("message", "Operação realizada com sucesso.");
            res.add("idFavorito", idFavorito);

            // Fecha a conexão
            mongo.fechar();
        } catch(erro) {
            mongo.fechar();
            res.add("message", `Erro de conexão: ${erro.message}`);
        }

        return response.json(res.get());
    },

    async getFavoritos(request, response) {
        // Recupera informações da requisição
        const { idCliente } = request.params;
        let query = Favorito.buscar(ObjectId(idCliente));

        // Cria variáveis de resposta, conexão e gerenciamento
        const res = new Response();
        const cliente = Config.getConexao();
        const mongo = new MongoDB(cliente);

        try {
            // Inicia a conexão
            await mongo.conectar();

            // Busca os lojistas favoritos para o cliente
            const favoritos = await mongo.buscar(Config.getColecaoFavoritos(), query);

            // Busca as informações detalhadas de cada lojista
            const list = [];
            for(let i = 0; i < favoritos.length; i++) {
                list.push(ObjectId(favoritos[i].lojista.oid));
            }
            const detalhes = await mongo.buscar(Config.getColecaoLojistas(), Lojista.findMult(list));

            for(let i = 0; i < favoritos.length; i++) {
                let lojista = {};
                for(let j = 0; j < detalhes.length; j++) {
                    if(detalhes[j]._id.toString() == favoritos[i].lojista.oid.toString()) {
                        lojista = detalhes[j];
                        break;
                    }
                }
                favoritos[i].detalhes = lojista;
            }

            // Organiza as respostas
            res.status(200);
            res.add("message", "Busca realizada com sucesso.");
            res.add("data", favoritos);

            // Fecha a conexão
            mongo.fechar();
        } catch(erro) {
            mongo.fechar();
            res.add("message", `Erro de conexão: ${erro.message}`);
        }

        return response.json(res.get());
    },

    async avaliar(request, response) {
        // Recupera informações da requisição
        const { idCliente, idLojista, classificacao, detalhes } = request.body;
        const nova = new Avaliacao(ObjectId(idCliente), ObjectId(idLojista), classificacao, detalhes);

        // Cria variáveis de resposta, conexão e gerenciamento
        const res = new Response();
        const cliente = Config.getConexao();
        const mongo = new MongoDB(cliente);

        try {
            // Inicia a conexão
            await mongo.conectar();

            // Verifica se o lojista já recebeu a avaliação
            const avaliacao = await mongo.buscar(Config.getColecaoRecomendacoes(), nova.existe());
            if(avaliacao.length != 0) {
                res.add("message", "Você já avaliou este lojista.");
                return response.json(res.get());
            }

            // Insere a nova avaliação
            const resAdd = await mongo.adicionar(Config.getColecaoRecomendacoes(), nova.novo());
            const idAvaliacao = resAdd.insertedId;

            // Organiza a resposta
            res.status(200);
            res.add("message", "Avaliação enviada com sucesso.");
            res.add("idAvaliacao", idAvaliacao);

            // Fecha a conexão
            mongo.fechar();
        } catch(erro) {
            mongo.fechar();
            res.add("message", `Erro de conexão: ${erro.message}`);
        }

        return response.json(res.get());
    },

    async updAvaliacao(request, response) {
        // Recupera informações da requisição
        const { idAvaliacao, classificacao, detalhes } = request.body;
        const upd = new Avaliacao("", "", classificacao, detalhes);
        upd.setId(ObjectId(idAvaliacao));

        // Cria variáveis de resposta, conexão e gerenciamento
        const res = new Response();
        const cliente = Config.getConexao();
        const mongo = new MongoDB(cliente);

        try {
            // Inicia a conexão
            await mongo.conectar();

            // Faz a alteração
            const resUpd = await mongo.atualizar(Config.getColecaoRecomendacoes(), upd.getId(), upd.getSetData());

            // Organiza a resposta
            res.status(200);
            res.add("message", "Atualização realizada com sucesso.");
            res.add("idAvaliacao", idAvaliacao);

            // Fecha a conexão
            mongo.fechar();
        } catch(erro) {
            mongo.fechar();
            res.add("message", `Erro de conexão: ${erro.message}`);
        }

        return response.json(res.get());
    }

};