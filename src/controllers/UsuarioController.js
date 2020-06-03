// Configurações de conexão
const { ObjectId } = require("mongodb");
const Config = require("../database/Config");
const MongoDB = require("../database/MongoDB");

// Auxiliares
const Response = require("../utils/Response");
const codificar = require("../utils/codificar");
const gerarToken = require("../utils/gerarToken");

// Models
const Usuario = require("../database/Usuario");
const Cliente = require("../database/Cliente");
const Lojista = require("../database/Lojista");

module.exports = {

    async novoUsuario(request, response) {
        // Recupera corpo da requisição
        const { email, senha } = request.body;
        const user = new Usuario(email, codificar(senha));

        // Cria variáveis de resposta, conexão e gerenciamento
        const res = new Response();
        const cliente = Config.getConexao();
        const mongo = new MongoDB(cliente);

        try {
            // Inicia conexão
            await mongo.conectar();

            // Verifica se o e-mail já está cadastrado
            const permitido = await mongo.emailPermitido(email);
            if(!permitido) {
                res.add("message", "O e-mail informado já está cadastrado.");
                mongo.fechar();
                return response.json(res.get());
            }

            // Adiciona o novo usuário ao banco
            const resAddUser = await mongo.adicionar(Config.getColecaoUsuarios(), user.get());
            const idUsuario = resAddUser.insertedId;
            user.setId(ObjectId(idUsuario));

            // Adiciona o novo cliente pelo ID de usuário cadastrado
            const resAddCli = await mongo.adicionar(Config.getColecaoClientes(), user.novoCliente());
            const idCliente = resAddCli.insertedId;

            // Adiciona o novo lojista pelo ID de usuário cadastrado
            const resAddLoj = await mongo.adicionar(Config.getColecaoLojistas(), user.novoLojista());
            const idLojista = resAddLoj.insertedId;

            // Organiza a resposta
            res.add("message", "Processo realizado com sucesso.");
            res.status(200);
            res.add("idUsuario", idUsuario);
            res.add("idCliente", idCliente);
            res.add("idLojista", idLojista);

            // Fecha a conexão
            mongo.fechar();
        } catch(erro) {
            mongo.fechar();
            res.add("message", `Erro de conexão: ${erro.message}`);
        }

        return response.json(res.get());
    },

    async updateCliente(request, response) {
        // Recupera corpo da requisição
        const { idCliente, nome, endereco, cidade, uf, whatsapp, pais } = request.body;
        const userCliente = new Cliente(ObjectId(idCliente), nome, endereco, cidade, uf, whatsapp, pais);

        // Cria variáveis de resposta, conexão e gerenciamento
        const res = new Response();
        const cliente = Config.getConexao();
        const mongo = new MongoDB(cliente);

        try {
            // Iinica a conexão
            await mongo.conectar();

            // Atualiza o perfil do cliente
            const resUpd = await mongo.atualizar(Config.getColecaoClientes(), userCliente.getId(), userCliente.getSetData());

            // Organiza a resposta
            res.add("message", "Operação realizada com sucesso.");
            res.status(200);

            // Fecha a conexão
            mongo.fechar();
        } catch(erro) {
            mongo.fechar();
            res.add("message", `Erro de conexão: ${erro.message}`);
        }

        return response.json(res.get());
    },

    async updateLojista(request, response) {
        // Recupera corpo da requisição
        const { idLojista, idSetor, nome, descricao, endereco, cidade, uf, whatsapp, pais } = request.body;
        const userLojista = new Lojista(ObjectId(idLojista), ObjectId(idSetor), nome, descricao, endereco, cidade, uf, whatsapp, pais);

        // Cria variáveis de resposta, conexão e gerenciamento
        const res = new Response();
        const cliente = Config.getConexao();
        const mongo = new MongoDB(cliente);

        try {
            // Inicia a conexão
            await mongo.conectar();

            // Verifica se o ID do setor informado é válido
            const existe = await mongo.existeId(Config.getColecaoSetores(), userLojista.getIdSetor());
            if(!existe) {
                res.add("message", "O setor informado (ID) não está no banco de dados.");
                mongo.fechar();
                return response.json(res.get());
            }

            // Faz a atualização
            const resUpd = await mongo.atualizar(Config.getColecaoLojistas(), userLojista.getId(), userLojista.getSetData());

            // Organiza a resposta
            res.add("message", "Operação realizada com sucesso.");
            res.status(200);

            // Fecha a conexão
            mongo.fechar();
        } catch(erro) {
            mongo.fechar();
            res.add("message", `Erro de conexão: ${erro.message}`);
        }

        return response.json(res.get());
    },

    async login(request, response) {
        // Recupera informações da requisição
        const { email, senha } = request.body;
        let send = { email, senha: codificar(senha) };

        // Criar variáveis de conexão e manipulação
        const res = new Response();
        const cliente = Config.getConexao();
        const mongo = new MongoDB(cliente);

        try {
            // Inicia a conexão
            await mongo.conectar();

            // Verifica se as informações estão no banco
            const validos = await mongo.buscar(Config.getColecaoUsuarios(), send);
            if(validos.length != 1) {
                res.add("message", "O e-mail ou a senha informados estão incorretos.");
                mongo.fechar();
                return response.json(res.get());
            }

            // Desmembra as informações
            const idUsuario = validos[0]._id;
            const token = gerarToken(idUsuario);
            send = { "usuario.$id": ObjectId(idUsuario) };

            // Busca as informações de Lojista e Cliente
            const dadosCliente = (await mongo.buscar(Config.getColecaoClientes(), send))[0];
            const dadosLojista = (await mongo.buscar(Config.getColecaoLojistas(), send))[0];

            // Organiza as informações de Lojista e Cliente
            const dataCliente = {
                idCliente: dadosCliente._id,
                completo: (dadosCliente.nome == "") ? false : true,
                nome: dadosCliente.nome,
                endereco: dadosCliente.endereco,
                cidade: dadosCliente.cidade,
                uf: dadosCliente.uf,
                whatsapp: dadosCliente.whatsapp,
                pais: dadosCliente.pais
            };
            const dataLojista = {
                idLojista: dadosLojista._id,
                completo: (dadosLojista.nome == "") ? false : true,
                nome: dadosLojista.nome,
                descricao: dadosLojista.descricao,
                endereco: dadosLojista.endereco,
                cidade: dadosLojista.cidade,
                uf: dadosLojista.uf,
                whatsapp: dadosLojista.whatsapp,
                pais: dadosLojista.pais
            };

            // Estrutura a resposta
            res.status(200);
            res.add("message", "Login realizado com sucesso.");
            res.add("idUsuario", idUsuario);
            res.add("dadosCliente", dataCliente);
            res.add("dadosLojista", dataLojista);
            res.add("token", token);

            // Fecha a conexão
            mongo.fechar();
        } catch(erro) {
            mongo.fechar();
            res.add("message", `Erro de conexão: ${erro.message}`);
        }

        return response.json(res.get());
    },

    async alterarSenha(request, response) {
        // Recupera informações da requisição
        const { email, senha, novaSenha } = request.body;
        let send = { email, senha: codificar(senha) };

        // Criar variáveis de conexão e manipulação
        const res = new Response();
        const cliente = Config.getConexao();
        const mongo = new MongoDB(cliente);

        try {
            // Inicia a conexão
            await mongo.conectar();

            // Verifica se o e-mail e senha estão corretos
            const dados = (await mongo.buscar(Config.getColecaoUsuarios(), send));
            if(dados.length != 1) {
                res.add("message", "A senha informada não corresponde a senha atual.");
                mongo.fechar();
                return response.json(res.get());
            }

            // Atualiza a nova senha
            send = { $set: { senha: codificar(novaSenha) } };
            const resUpd = await mongo.atualizar(Config.getColecaoUsuarios(), ObjectId(dados[0]._id), send);

            // Estrutura a resposta
            res.status(200);
            res.add("message", "Alteração realizada com sucesso.");
            res.add("idUsuario", dados[0]._id);

            // Fechar a conexão
            mongo.fechar();
        } catch(erro) {
            mongo.fechar();
            res.add("message", `Erro de conexão: ${erro.message}`);
        }

        return response.json(res.get());
    }

};