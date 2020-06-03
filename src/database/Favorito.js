const Config = require("./Config");

class Favorito {

    constructor(oidCliente, oidLojista) {
        this.idCliente = oidCliente;
        this.idLojista = oidLojista;

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
            }
        };
    }

    existe() {
        return {
            "cliente.$id": this.idCliente,
            "lojista.$id": this.idLojista
        };
    }

    static buscar(oidCliente) {
        return {
            "cliente.$id": oidCliente
        }
    }

}

module.exports = Favorito;