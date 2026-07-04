const db = require('./database');

exports.cadastrarFornecedor = (req, res) => {
    const { nome, cnpj, endereco, contato } = req.body;
    
    const sql = `INSERT INTO fornecedores (nome, cnpj, endereco, contato) VALUES (?, ?, ?, ?)`;
    
    db.run(sql, [nome, cnpj, endereco, contato], function(err) {
        if (err) {
            return res.status(400).json({ error: "Erro ao cadastrar fornecedor: " + err.message });
        }
        res.status(201).json({ message: "Fornecedor cadastrado com sucesso!", id: this.lastID });
    });
};

// ADICIONE ESTA FUNÇÃO PARA O ERRO NO ROTAS.JS DESAPARECER:
exports.listarFornecedores = (req, res) => {
    db.all("SELECT * FROM fornecedores", [], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json(rows);
    });
};