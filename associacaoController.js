const db = require('./database');

// Associar Produto a Fornecedor
exports.associar = (req, res) => {
    const { produto_id, fornecedor_id } = req.body;

    if (!produto_id || !fornecedor_id) {
        return res.status(400).json({ error: 'Produto e Fornecedor são obrigatórios.' });
    }

    // Verificar se a associação já existe
    db.get(`SELECT * FROM produto_fornecedor WHERE produto_id = ? AND fornecedor_id = ?`,
        [produto_id, fornecedor_id], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            if (row) {
                return res.status(400).json({ error: 'Fornecedor já está associado a este produto!' });
            }

            db.run(`INSERT INTO produto_fornecedor (produto_id, fornecedor_id) VALUES (?, ?)`,
                [produto_id, fornecedor_id], function(err) {
                    if (err) return res.status(400).json({ error: 'Erro na associação: ' + err.message });
                    res.status(201).json({ message: 'Fornecedor associado com sucesso ao produto!' });
                });
        });
};

// Desassociar Fornecedor de Produto
exports.desassociar = (req, res) => {
    const { produto_id, fornecedor_id } = req.body;

    if (!produto_id || !fornecedor_id) {
        return res.status(400).json({ error: 'Produto e Fornecedor são obrigatórios.' });
    }

    db.run(`DELETE FROM produto_fornecedor WHERE produto_id = ? AND fornecedor_id = ?`,
        [produto_id, fornecedor_id], function(err) {
            if (err) return res.status(400).json({ error: err.message });
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Associação não encontrada.' });
            }
            res.json({ message: 'Fornecedor desassociado com sucesso!' });
        });
};

// Listar Fornecedores associados a um Produto
exports.listarFornecedoresPorProduto = (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT f.id, f.nome, f.cnpj, f.endereco, f.contato, f.telefone, f.email
        FROM fornecedores f
        INNER JOIN produto_fornecedor pf ON f.id = pf.fornecedor_id
        WHERE pf.produto_id = ?
    `;
    db.all(sql, [id], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json(rows);
    });
};
