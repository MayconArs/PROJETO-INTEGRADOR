const express = require('express');
const router = express.Router();
const produtoController = require('./produtoController');
const fornecedorController = require('./fornecedorController');
const associacaoController = require('./associacaoController'); // Adicione esta linha

// Rotas de Produto
router.post('/produtos', produtoController.cadastrarProduto);
router.delete('/produtos/:id', produtoController.excluirProduto);
router.get('/produtos', produtoController.listarProdutos); // Recomendado para o Frontend

// Rotas de Fornecedor
router.post('/fornecedores', fornecedorController.cadastrarFornecedor);
router.get('/fornecedores', fornecedorController.listarFornecedores); // Recomendado para o Frontend

// Rota de Associação (Conforme requisito da Fase 1/Etapa 3)
router.post('/associar', associacaoController.associar);

module.exports = router;