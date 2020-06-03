const { ObjectId } = require("mongodb");
const Config = require("../database/Config");

function newDate() {
    const objData = new Date();
    return `${objData.getFullYear()}-${objData.getMonth() + 1}-${objData.getDate()}`;
};

function NewDocumentSetor(idSetor, idCliente, pais, uf, cidade, data) {
    return {
        setor: {
            $ref: Config.getColecaoSetores(),
            $id: ObjectId(idSetor),
            $db: Config.getNomeBanco()
        },
        clientes: [idCliente],
        pais, uf, cidade, data, total: 1
    };
};

function NewDocument(idLojista, idCliente, data) {
    return {
        lojista: {
            $ref: Config.getColecaoLojistas(),
            $id: ObjectId(idLojista),
            $db: Config.getNomeBanco()
        },
        clientes: [idCliente],
        data,
        total: 1
    };
};

function buscador(idLojista, data) {
    return {
        "lojista.$id": ObjectId(idLojista),
        data
    };
};

function setDocument(idCliente, atual) {
    return {
        $push: {
            clientes: idCliente
        },
        $set: {
            total: atual + 1
        }
    };
}

module.exports = {

    async resultadoBusca(idSetor, idCliente, pais, uf, cidade, mongo) {
        // Verifica se na data atual, algum registro foi criado
        const data = newDate();
        const query = { "setor.$id": ObjectId(idSetor), pais, uf, cidade, data };
        const registro = await mongo.buscar(Config.getColecaoBuscas(), query);

        if(registro.length == 0) {
            // Cria um registro para a data
            const novo = NewDocumentSetor(idSetor, idCliente, pais, uf, cidade, data);
            await mongo.adicionar(Config.getColecaoBuscas(), novo);
        } else {
            // Atualiza registro
            const set = setDocument(idCliente, registro[0].total);
            await mongo.atualizar(Config.getColecaoBuscas(), ObjectId(registro[0]._id), set);
        }
    },

    async resultadoCliques(idLojista, idCliente, mongo) {
        // Verifica se na data atual, algum registro foi criado
        const data = newDate();
        const query = buscador(idLojista, data);
        const registro = await mongo.buscar(Config.getColecaoCliques(), query);

        if(registro.length == 0) {
            // Cria um registro para a data
            const novo = NewDocument(idLojista, idCliente, data);
            await mongo.adicionar(Config.getColecaoCliques(), novo);
        } else {
            // Atualiza registro
            const set = setDocument(idCliente, registro[0].total);
            await mongo.atualizar(Config.getColecaoCliques(), ObjectId(registro[0]._id), set);
        }
    },

    async resultadoContato(idLojista, idCliente, mongo) {
        // Verifica se na data atual, algum registro foi criado
        const data = newDate();
        const query = buscador(idLojista, data);
        const registro = await mongo.buscar(Config.getColecaoContato(), query);

        if(registro.length == 0) {
            // Cria um registro para a data
            const novo = NewDocument(idLojista, idCliente, data);
            await mongo.adicionar(Config.getColecaoContato(), novo);
        } else {
            // Atualiza registro
            const set = setDocument(idCliente, registro[0].total);
            await mongo.atualizar(Config.getColecaoContato(), ObjectId(registro[0]._id), set);
        }
    }

};