const Config = require("./Config");

class MongoDB {

    constructor(mongoCliente) {
        this.cliente = mongoCliente;

        this.nomeBanco = Config.getNomeBanco();
        this.colecaoUsuarios = Config.getColecaoUsuarios();
    }

    async conectar() {
        await this.cliente.connect();
    }

    fechar() {
        this.cliente.close();
    }

    async adicionar(collection, data) {
        const dbres = await this.cliente.db(this.nomeBanco).collection(collection).insertOne(data);
        return dbres;
    }

    async atualizar(collection, objectId, setData) {
        const dbres = await this.cliente.db(this.nomeBanco).collection(collection).updateOne({
            _id: objectId
        }, setData);
        return dbres;
    }

    async buscar(collection, query) {
        const colecao = this.cliente.db(this.nomeBanco).collection(collection);
        const data = await colecao.find(query).toArray();
        return data;
    }

    async existeId(collection, id) {
        const colecao = this.cliente.db(this.nomeBanco).collection(collection);
        const data = await colecao.find({ _id: id }).toArray();

        if(data.length == 0) {
            return false;
        } else {
            return true;
        }
    }

    async emailPermitido(email) {
        const colecao = this.cliente.db(this.nomeBanco).collection(this.colecaoUsuarios);
        const data = await colecao.find({ email }).toArray();

        if(data.length == 0) {
            return true;
        } else {
            return false;
        }
    }

}

module.exports = MongoDB;