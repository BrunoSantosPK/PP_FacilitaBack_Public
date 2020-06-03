const Config = require("./Config");

class Avaliacao {

    constructor(oidCliente, oidLojista, classificacao, detalhes) {
        this.idCliente = oidCliente;
        this.idLojista = oidLojista;
        this.classificacao = classificacao;
        this.detalhes = detalhes;

        this.id = "";
    }

    setId(id) {
        this.id = id;
    }

    getId() {
        return this.id;
    }

    novo() {
        return {
            cliente: {
                $ref: Config.getColecaoClientes(),
                $id: this.idCliente,
                $db: Config.getNomeBanco()
            },
            lojista: {
                $ref: Config.getColecaoLojistas(),
                $id: this.idLojista,
                $db: Config.getNomeBanco()
            },
            nota: this.classificacao,
            detalhes: this.detalhes
        };
    }

    getSetData() {
        return {
            $set: {
                nota: this.classificacao,
                detalhes: this.detalhes
            }
        };
    }

    existe() {
        return {
            "lojista.$id": this.idLojista,
            "cliente.$id": this.idCliente
        };
    }

    static buscar(oidCliente) {
        return {
            "cliente.$id": oidCliente
        }
    }

}

module.exports = Avaliacao;