const db = require('./database');

exports.associar = (req, res) => {
    const { produto_id, fornecedor_id } = req.body;
    db.run(`INSERT INTO produto_fornecedor (produto_id, fornecedor_id) VALUES (?, ?)`, 
    [produto_id, fornecedor_id], function(err) {
        if (err) return res.status(400).json({ error: "Erro na associação: " + err.message });
        res.status(201).json({ message: "Associação criada com sucesso!" });
    });
};