class Response {

    constructor() {
        this.body = {
            statusCode: 400
        };
    }

    add(chave, valor) {
        this.body[chave] = valor;
    }

    status(code) {
        this.body.statusCode = code;
    }

    get() {
        return this.body;
    }

}

module.exports = Response;