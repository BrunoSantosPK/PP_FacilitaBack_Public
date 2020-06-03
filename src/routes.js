const express = require("express");

// Controllers
const usuario = require("./controllers/UsuarioController");
const lojista = require("./controllers/LojistaController");
const setores = require("./controllers/AreaController");
const cliente = require("./controllers/ClienteController");
const avisos = require("./controllers/AvisosController");


// Validações para rota de usuários 
const validarNovoUsuario = require("./validators/usuarios/novoUsuario");
const validarPerfilCliente = require("./validators/usuarios/perfilCliente");
const validarPerfilLojista = require("./validators/usuarios/perfilLojista");
const validarLogin = require("./validators/usuarios/login");
const validarNovaSenha = require("./validators/usuarios/alterarSenha");


// Validações para rota de setores
const validarAcesso = require("./validators/setores/chaveAcesso");
const validarNovoSetor = require("./validators/setores/novaArea");


// Validações para rota de lojistas
const validarGetLojista = require("./validators/lojistas/getLojista");
const validarNovoItem = require("./validators/lojistas/novoItem");
const validarNovaFoto = require("./validators/lojistas/novaFoto");
const validarAtualizarItem = require("./validators/lojistas/atualizarItem");


// Validações para a rota de clientes
const validarBuscarLojistas = require("./validators/clientes/getLojistas");
const validarDetalhesLojista = require("./validators/clientes/detalhesLojista");
const validarIdCliente = require("./validators/clientes/idCliente");
const validarAvaliacao = require("./validators/clientes/avaliacao");
const validarAtualizarAvaliacao = require("./validators/clientes/atualizarAvaliacao");


// Define a variável de rotas
const routes = express.Router();


// Gerenciamento de avisos e informações
routes.get("/novidades", avisos.getNovidades);


// Manipulação de áreas
routes.post("/setores/novo", validarNovoSetor, setores.adicionar);
routes.get("/setores", validarAcesso, setores.listar);


// Manipulação de usuários
routes.post("/usuarios/login", validarLogin, usuario.login);
routes.post("/usuarios/novo", validarNovoUsuario, usuario.novoUsuario);
routes.put("/usuarios/senha", validarNovaSenha, usuario.alterarSenha);
routes.put("/usuarios/perfil/cliente", validarPerfilCliente, usuario.updateCliente);
routes.put("/usuarios/perfil/lojista", validarPerfilLojista, usuario.updateLojista);


// Operações realizadas pelo lojista
routes.get("/lojistas/recomendacoes/:idLojista", validarGetLojista, lojista.getRecomendacoes);
routes.get("/lojistas/catalogo/:idLojista", validarGetLojista, lojista.getCatalogo);
routes.post("/lojistas/catalogo/novo", validarNovoItem, lojista.novoItem);
routes.post("/lojistas/catalogo/foto", validarNovaFoto, lojista.atualizarFoto);
routes.put("/lojistas/catalogo/atualizar", validarAtualizarItem, lojista.atualizarItem);
routes.get("/lojistas/favoritos/:idLojista", validarGetLojista, lojista.getFavoritos);


// Operações realizadas pelo cliente
routes.post("/clientes/buscar/lojistas", validarBuscarLojistas, cliente.getLojistas);
routes.post("/clientes/buscar/detalhes", validarDetalhesLojista, cliente.getLojista);
routes.post("/clientes/contato/registrar", validarDetalhesLojista, cliente.cadastrarContato);
routes.post("/clientes/favoritar", validarDetalhesLojista, cliente.favoritar);
routes.post("/clientes/avaliar", validarAvaliacao, cliente.avaliar);
routes.post("/clientes/avaliar/atualizar", validarAtualizarAvaliacao, cliente.updAvaliacao);
routes.get("/clientes/favoritos/:idCliente", validarIdCliente, cliente.getFavoritos);
routes.get("/clientes/avaliacoes/:idCliente", validarIdCliente, cliente.getAvaliacoes);


// Operações realizadas pelo Premium (Lojista)


module.exports = routes;