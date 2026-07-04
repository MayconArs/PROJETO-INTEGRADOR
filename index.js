const express = require('express');
const cors = require('cors');
const db = require('./database'); // Conexão com o banco
const rotas = require('./rotas'); // Suas rotas

const app = express();

// Configurações globais
app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
    res.send('API de Estoque rodando!');
});

// Registra as rotas
app.use(rotas);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}/`);
});