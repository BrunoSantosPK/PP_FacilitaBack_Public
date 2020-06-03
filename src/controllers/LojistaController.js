// Configurações de conexão
const { ObjectId } = require("mongodb");
const Config = require("../database/Config");
const MongoDB = require("../database/MongoDB");

// Imports para gerenciamento de imagens
const multer = require("multer");
const fs = require("fs");

// Auxiliares
const Response = require("../utils/Response");
const sendFile = require("../utils/upload");

// Models
const Item = require("../database/Item");
const Cliente = require("../database/Cliente");

module.exports = {

    async getRecomendacoes(request, response) {
        // Recupera dados da requisição
        const { idLojista } = request.params;
        const query = { "lojista.$id": ObjectId(idLojista) };

        // Cria variáveis de resposta, conexão e gerenciamento
        const res = new Response();
        const cliente = Config.getConexao();
        const mongo = new MongoDB(cliente);

        try {
            // Inicia a conexão
            await mongo.conectar();

            // Busca as recomendações
            const recomendacoes = await mongo.buscar(Config.getColecaoRecomendacoes(), query);

            // Busca dados detalhados de cada cliente
            const listaIds = [];
            for(let i = 0; i < recomendacoes.length; i++) {
                listaIds.push(ObjectId(recomendacoes[i].cliente.oid));
            }
            const detalhes = await mongo.buscar(Config.getColecaoClientes(), Cliente.findMult(listaIds));

            for(let i = 0; i < recomendacoes.length; i++) {
                let cliente = {};
                for(let j = 0; j < detalhes.length; j++) {
                    if(detalhes[j]._id.toString() == recomendacoes[i].cliente.oid.toString()) {
                        cliente = detalhes[j];
                        break;
                    }
                }
                recomendacoes[i].cliente = cliente;
            }

            // Organiza as informações de resposta
            res.status(200);
            res.add("message", "Busca realizada com sucesso.");
            res.add("data", recomendacoes);

            // Fecha a conexão
            mongo.fechar();
        } catch(erro) {
            mongo.fechar();
            res.add("message", `Erro de conexão: ${erro.message}`);
        }

        return response.json(res.get());
    },

    async getCatalogo(request, response) {
        // Recupera dados da requisição
        const { idLojista } = request.params;
        const query = { "lojista.$id": ObjectId(idLojista) };

        // Cria variáveis de resposta, conexão e gerenciamento
        const res = new Response();
        const cliente = Config.getConexao();
        const mongo = new MongoDB(cliente);

        try {
            // Inicia a conexão
            await mongo.conectar();

            // Busca as recomendações
            const catalago = await mongo.buscar(Config.getColecaoCatalogo(), query);

            // Organiza as informações de resposta
            res.status(200);
            res.add("message", "Busca realizada com sucesso.");
            res.add("data", catalago);

            // Fecha a conexão
            mongo.fechar();
        } catch(erro) {
            mongo.fechar();
            res.add("message", `Erro de conexão: ${erro.message}`);
        }

        return response.json(res.get());
    },

    async novoItem(request, response) {
        // Recupera dados da requisição
        const { idLojista, nome, descricao, preco } = request.body;
        const item = new Item(ObjectId(idLojista), nome, descricao, preco);

        // Cria variáveis de resposta, conexão e gerenciamento
        const res = new Response();
        const cliente = Config.getConexao();
        const mongo = new MongoDB(cliente);

        try {
            // Inicia a conexão
            await mongo.conectar();

            // Envia item para o catálogo
            const resAdd = await mongo.adicionar(Config.getColecaoCatalogo(), item.novo());
            const idItem = resAdd.insertedId;

            // Organiza a resposta
            res.status(200);
            res.add("message", "Item criado com sucesso.");
            res.add("idItem", idItem);

            // Fecha a conexão
            mongo.fechar();
        } catch(erro) {
            mongo.fechar();
            res.add("message", `Erro de conexão: ${erro.message}`);
        }

        return response.json(res.get());
    },

    async atualizarFoto(request, response) {
        // Recupera dados da requisição
        const id = request.headers.id;
        const uploadFile = multer({ storage: sendFile.upload }).single("foto");

        // Cria variáveis de resposta, conexão e gerenciamento
        const res = new Response();
        const cliente = Config.getConexao();
        const mongo = new MongoDB(cliente);

        uploadFile(request, response, erro => {
            if(erro) {
                res.add("message", erro);
                return response.json(res.get());
            }

            // Define as variáveis para salvar o item
            const path = request.file.path;
            const uniqueFilename = `item-${id}`;

            sendFile.cloudinary.uploader.upload(
                path,
                { public_id: `saber/${uniqueFilename}` },
                async (erro, image) => {
                    if(erro) {
                        res.add("message", erro);
                        return response.json(res.get());
                    }

                    // Remove o item do armazenamento interno
                    fs.unlinkSync(path);

                    // Inicia a conexão
                    await mongo.conectar();

                    // Altera o documento do item
                    const send = { $set: { foto: image.secure_url } };
                    const resUpd = await mongo.atualizar(Config.getColecaoCatalogo(), ObjectId(id), send);

                    // Fecha a conexão
                    mongo.fechar();

                    // Organiza a resposta
                    res.status(200);
                    res.add("message", "Atualização de imagem feita com sucesso.");
                    res.add("idItem", id);
                    res.add("dadosImagem", image);
                    return response.json(res.get());
                }
            );
        });
    },

    async atualizarItem(request, response) {
        // Recupera informações da requisição
        const { idItem, nome, descricao, preco } = request.body;
        const item = new Item("", nome, descricao, preco);
        item.setId(ObjectId(idItem));

        // Cria variáveis de resposta, conexão e gerenciamento
        const res = new Response();
        const cliente = Config.getConexao();
        const mongo = new MongoDB(cliente);

        try {
            // Inicia a conexão
            await mongo.conectar();

            // Altera as informações no banco
            const resUpd = await mongo.atualizar(Config.getColecaoCatalogo(), item.getId(), item.getSetData());

            // Organiza a resposta
            res.status(200);
            res.add("message", "Alteração realizada com sucesso.");
            res.add("idItem", idItem);
            res.add("novosDados",  { nome, descricao, preco });

            // Fecha a conexão
            mongo.fechar();
        } catch(erro) {
            mongo.fechar();
            res.add("message", `Erro de conexão: ${erro.message}.`);
        }

        return response.json(res.get());
    },

    async getFavoritos(request, response) {
        // Recupera informações da requisição
        const { idLojista } = request.params;
        const query = { "lojista.$id": ObjectId(idLojista) };

        // Cria variáveis de resposta, conexão e gerenciamento
        const res = new Response();
        const cliente = Config.getConexao();
        const mongo = new MongoDB(cliente);

        try {
            // Inicia a conexão
            await mongo.conectar();

            // Busca os dados
            const favoritos = await mongo.buscar(Config.getColecaoFavoritos(), query);

            // Busca dados detalhados de cada cliente
            const listaIds = [];
            for(let i = 0; i < favoritos.length; i++) {
                listaIds.push(ObjectId(favoritos[i].cliente.oid));
            }
            const detalhes = await mongo.buscar(Config.getColecaoClientes(), Cliente.findMult(listaIds));

            for(let i = 0; i < favoritos.length; i++) {
                let cliente = {};
                for(let j = 0; j < detalhes.length; j++) {
                    if(detalhes[j]._id.toString() == favoritos[i].cliente.oid.toString()) {
                        cliente = detalhes[j];
                        break;
                    }
                }
                favoritos[i].cliente = cliente;
            }

            // Estrutura a resposta
            res.status(200);
            res.add("message", "Busca realizada com sucesso.");
            res.add("idLojista", idLojista);
            res.add("data", favoritos);

            // Fecha a conexão
            mongo.fechar();
        } catch(erro) {
            mongo.fechar();
            res.add("message", `Erro de conexão: ${erro.message}.`);
        }

        return response.json(res.get());
    }

};