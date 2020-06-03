const Config = require("./Config");

class Item {

    constructor(idLojista, nome, descricao, preco) {
        this.idLojista = idLojista;
        this.nome = nome;
        this.descricao = descricao;
        this.preco = preco;

        this.id = "";
        this.imagem = "https://res.cloudinary.com/ds2c7t61p/image/upload/v1588685211/saber/imagem-padrao_zbwiji.png";
    }

    setId(id) {
        this.id = id;
    }

    getId() {
        return this.id;
    }

    novo() {
        return {
            nome: this.nome,
            descricao: this.descricao,
            preco: this.preco,
            lojista: {
                $ref: Config.getColecaoLojistas(),
                $id: this.idLojista,
                $db: Config.getNomeBanco()
            },
            foto: this.imagem
        };
    }

    getSetData() {
        return {
            $set: {
                nome: this.nome,
                descricao: this.descricao,
                preco: this.preco
            }
        };
    }

}

module.exports = Item;