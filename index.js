require("dotenv-safe").config();

const app = require("./src/app");

const port = normalizarPorta(process.env.PORT || "3030");

app.listen(port);

function normalizarPorta(valor) {
    const port = parseInt(valor, 10);
    if(isNaN(port)) {
        return valor;
    }
    if(port >= 0) {
        return port;
    }
    return false;
}