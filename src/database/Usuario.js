const Config = require("./Config");

class Usuario {

    constructor(email, senha) {
        this.email = email;
        this.senha = senha;
        this.criacao = (new Date()).toISOString();

        this.id = "";
        this.colecao = Config.getColecaoUsuarios();
        this.banco = Config.getNomeBanco();
    }

    get() {
        return {
            email: this.email,
            senha: this.senha,
            dataCriacao: this.criacao
        };
    }

    setId(id) {
        this.id = id;
    }

    novoLojista() {
        return {
            usuario: {
                $ref: this.colecao,
                $id: this.id,
                $db: this.banco
            },
            nome: "",
            descricao: "",
            endereco: "",
            cidade: "",
            uf: "",
            whatsapp: "",
            pais: ""
        };
    }

    novoCliente() {
        return {
            usuario: {
                $ref: this.colecao,
                $id: this.id,
                $db: this.banco
            },
            nome: "",
            endereco: "",
            cidade: "",
            uf: "",
            whatsapp: "",
            pais: ""
        };
    }

}

module.exports = Usuario;