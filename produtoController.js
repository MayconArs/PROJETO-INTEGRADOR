const db = require('./database');

exports.cadastrarProduto = (req, res) => {
    const { nome, descricao, codigo_barras, quantidade, categoria } = req.body;
    
    const sql = `INSERT INTO produtos (nome, descricao, codigo_barras, quantidade, categoria) VALUES (?, ?, ?, ?, ?)`;
    
    db.run(sql, [nome, descricao, codigo_barras, quantidade, categoria], function(err) {
        if (err) {
            return res.status(400).json({ error: "Erro ao cadastrar: " + err.message });
        }
        res.status(201).json({ message: "Produto cadastrado com sucesso!", id: this.lastID });
    });
};

exports.excluirProduto = (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM produtos WHERE id = ?`, [id], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "Deletado com sucesso" });
    });
};

// Adicione isto ao seu produtoController.js
exports.listarProdutos = (req, res) => {
    db.all("SELECT * FROM produtos", [], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json(rows);
    });
};