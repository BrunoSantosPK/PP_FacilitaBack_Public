const Config = require("./Config");

class Lojista {

    constructor(objectId, objectIdSetor, nome, descricao, endereco, cidade, uf, whatsapp, pais) {
        this.id = objectId;
        this.idSetor = objectIdSetor;
        this.nome = nome;
        this.descricao = descricao;
        this.endereco = endereco;
        this.cidade = cidade;
        this.uf = uf;
        this.whatsapp = whatsapp;
        this.pais = pais;
    }

    getId() {
        return this.id;
    }

    getIdSetor() {
        return this.idSetor;
    }

    getSetData() {
        return {
            $set: {
                nome: this.nome,
                descricao: this.descricao,
                endereco: this.endereco,
                cidade: this.cidade,
                uf: this.uf,
                whatsapp: this.whatsapp,
                pais: this.pais,
                setor: {
                    $ref: Config.getColecaoSetores(),
                    $id: this.idSetor,
                    $db: Config.getNomeBanco()
                }
            }
        };
    }

    static findMult(listOID) {
        return {
            _id: {
                $in: listOID
            }
        };
    }

}

module.exports = Lojista;