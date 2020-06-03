class Validator {

    static token(errs) {
        errs.forEach(err => err.message = "A chave de validação está incorreta.");
        return errs;
    }

    static id(errs) {
        errs.forEach(err => err.message = "É preciso que se informa um ID para cadastro.");
        return errs;
    }

    static idCliente(errs) {
        errs.forEach(err => err.message = "É preciso enviar o ID do cliente corretamente.");
        return errs;
    }

    static idLojista(errs) {
        errs.forEach(err => err.message = "É preciso enviar o ID do lojista corretamente.");
        return errs;
    }

    static idSetor(errs) {
        errs.forEach(err => err.message = "É preciso enviar o ID do setor corretamente.");
        return errs;
    }

    static idAvaliacao(errs) {
        errs.forEach(err => err.message = "É preciso enviar o ID da avaliação corretamente.");
        return errs;
    }

    static idItem(errs) {
        errs.forEach(err => err.message = "É preciso enviar o ID do item corretamente.");
        return errs;
    }

    static uf(errs) {
        errs.forEach(err => err.message = "Deve-se informar a UF com dois dígitos.");
        return errs;
    }

    static classificacao(errs) {
        errs.forEach(err => err.message = "A avaliação do lojista deve ser um número entre 1 e 5.");
        return errs;
    }

    static detalhes(errs) {
        errs.forEach(err => err.message = "Deixe um comentário sobre o lojista, utilizando no mínimo 10 caracteres e no máximo 100.");
        return errs;
    }

    static nomeSetor(errs) {
        errs.forEach(err => err.message = "O nome precisa conter no mínimo 5 caracteres e no máximo 20 caracteres.");
        return errs;
    }

    static descricaoSetor(errs) {
        errs.forEach(err => err.message = "A descrição deve ser informado com ao menos 10 caracteres e no máximo 100 caracteres.");
        return errs;
    }

    static nomeItem(errs) {
        errs.forEach(err => err.message = "Dê um nome para o item com ao menos 3 caracteres e no máximo 30 caracteres.");
        return errs;
    }

    static descricaoItem(errs) {
        errs.forEach(err => err.message = "Descreva o item com ao menos 10 caracteres e no máximo 100 caracteres.");
        return errs;
    }

    static precoItem(errs) {
        errs.forEach(err => err.message = "Você precisa informar um preço válido, maior do que 0.");
        return errs;
    }

    static email(errs) {
        errs.forEach(err => err.message = "O e-mail informado não é válido.");
        return errs;
    }

    static senha(errs) {
        errs.forEach(err => err.message = "A senha deve ter entre 3 e 20 caracteres.");
        return errs;
    }

    static nomePerfil(errs) {
        errs.forEach(err => err.message = "O nome deve conter ao menos 3 caracteres, sendo 100 no máximo.");
        return errs;
    }

    static endereco(errs) {
        errs.forEach(err => err.message = "Informe um endereço válido, que contenha ao máximo 50 caracteres.");
        return errs;
    }

    static cidade(errs) {
        errs.forEach(err => err.message = "Informe o nome da cidade com até 50 caracteres.");
        return errs;
    }

    static pais(errs) {
        errs.forEach(err => err.message = "Informe o nome do país com até 50 caracteres.");
        return errs;
    }

    static zap(errs) {
        errs.forEach(err => err.message = "Informe o número de telefone com o DDD.");
        return errs;
    }

    static descricaoPerfil(errs) {
        errs.forEach(err => err.message = "Uma descrição, com no mínimo 10 caracteres e no máximo 100 caracteres, deve ser informada para a atividade.");
        return errs;
    }

}

module.exports = Validator;