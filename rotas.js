const express = require('express');
const router = express.Router();
const produtoController = require('./produtoController');
const fornecedorController = require('./fornecedorController');
const associacaoController = require('./associacaoController');

// Rotas de Produto
router.post('/produtos', produtoController.cadastrarProduto);
router.get('/produtos', produtoController.listarProdutos);
router.get('/produtos/:id', produtoController.obterProdutoPorId);
router.put('/produtos/:id', produtoController.atualizarProduto);
router.delete('/produtos/:id', produtoController.excluirProduto);

// Rotas de Fornecedor
router.post('/fornecedores', fornecedorController.cadastrarFornecedor);
router.get('/fornecedores', fornecedorController.listarFornecedores);
router.put('/fornecedores/:id', fornecedorController.atualizarFornecedor);
router.delete('/fornecedores/:id', fornecedorController.excluirFornecedor);

// Rotas de Associação
router.post('/associar', associacaoController.associar);
router.delete('/associar', associacaoController.desassociar);
router.get('/produtos/:id/fornecedores', associacaoController.listarFornecedoresPorProduto);

module.exports = router;
