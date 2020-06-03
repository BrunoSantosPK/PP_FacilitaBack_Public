class Cliente {

    constructor(objectId, nome, endereco, cidade, uf, whatsapp, pais) {
        this.id = objectId;
        this.nome = nome;
        this.endereco = endereco;
        this.cidade = cidade;
        this.uf = uf;
        this.whatsapp = whatsapp;
        this.pais = pais;
    }

    getId() {
        return this.id;
    }

    getSetData() {
        return {
            $set: {
                nome: this.nome,
                endereco: this.endereco,
                cidade: this.cidade,
                uf: this.uf,
                whatsapp: this.whatsapp,
                pais: this.pais
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

module.exports = Cliente;