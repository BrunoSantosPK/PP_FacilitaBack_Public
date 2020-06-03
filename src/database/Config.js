const { MongoClient } = require("mongodb");

class Config {

    static getNomeBanco() {
        return "saber";
    }

    static getColecaoUsuarios() {
        return "usuarios";
    }

    static getColecaoLojistas() {
        return "lojistas";
    }

    static getColecaoClientes() {
        return "clientes";
    }

    static getColecaoSetores() {
        return "setores";
    }

    static getColecaoRecomendacoes() {
        return "recomendacoes";
    }

    static getColecaoCatalogo() {
        return "catalogo";
    }

    static getColecaoFavoritos() {
        return "favoritos";
    }

    static getColecaoBuscas() {
        return "resultado_buscas";
    }

    static getColecaoCliques() {
        return "resultado_cliques";
    }

    static getColecaoContato() {
        return "resultado_contato";
    }

    static getConexao() {
        const url = "mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/test?retryWrites=true&w=majority";
        const parser = {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        };

        const cliente = new MongoClient(url, parser);
        return cliente;
    }

}

module.exports = Config;