const db = require('./database');

// Cadastrar Produto
exports.cadastrarProduto = (req, res) => {
    const { nome, descricao, codigo_barras, quantidade, categoria } = req.body;

    // Validação de campos obrigatórios
    const erros = {};
    if (!nome || nome.trim() === '') erros.nome = 'O campo Nome é obrigatório.';
    if (!descricao || descricao.trim() === '') erros.descricao = 'O campo Descrição é obrigatório.';
    if (!categoria || categoria.trim() === '') erros.categoria = 'O campo Categoria é obrigatório.';

    if (Object.keys(erros).length > 0) {
        return res.status(400).json({ error: 'Campos obrigatórios não preenchidos.', erros });
    }

    // Verificar duplicidade de código de barras (somente se foi informado)
    if (codigo_barras && codigo_barras.trim() !== '') {
        db.get(`SELECT id FROM produtos WHERE codigo_barras = ?`, [codigo_barras], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            if (row) {
                return res.status(400).json({ error: 'Produto com este código de barras já está cadastrado!' });
            }
            inserirProduto();
        });
    } else {
        inserirProduto();
    }

    function inserirProduto() {
        const sql = `INSERT INTO produtos (nome, descricao, codigo_barras, quantidade, categoria) VALUES (?, ?, ?, ?, ?)`;

        db.run(sql, [nome, descricao, codigo_barras || null, quantidade || 0, categoria], function(err) {
            if (err) {
                return res.status(400).json({ error: 'Erro ao cadastrar: ' + err.message });
            }
            res.status(201).json({ message: 'Produto cadastrado com sucesso!', id: this.lastID });
        });
    }
};

// Excluir Produto
exports.excluirProduto = (req, res) => {
    const { id } = req.params;
    // Primeiro, remover associações na tabela produto_fornecedor
    db.run(`DELETE FROM produto_fornecedor WHERE produto_id = ?`, [id], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        db.run(`DELETE FROM produtos WHERE id = ?`, [id], function(err) {
            if (err) return res.status(400).json({ error: err.message });
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Produto não encontrado.' });
            }
            res.json({ message: 'Produto excluído com sucesso!' });
        });
    });
};

// Listar Produtos
exports.listarProdutos = (req, res) => {
    db.all("SELECT * FROM produtos", [], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json(rows);
    });
};

// Obter Produto por ID
exports.obterProdutoPorId = (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM produtos WHERE id = ?", [id], (err, row) => {
        if (err) return res.status(400).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Produto não encontrado.' });
        res.json(row);
    });
};

// Atualizar Produto
exports.atualizarProduto = (req, res) => {
    const { id } = req.params;
    const { nome, descricao, codigo_barras, quantidade, categoria } = req.body;

    // Validação de campos obrigatórios
    const erros = {};
    if (!nome || nome.trim() === '') erros.nome = 'O campo Nome é obrigatório.';
    if (!descricao || descricao.trim() === '') erros.descricao = 'O campo Descrição é obrigatório.';
    if (!categoria || categoria.trim() === '') erros.categoria = 'O campo Categoria é obrigatório.';

    if (Object.keys(erros).length > 0) {
        return res.status(400).json({ error: 'Campos obrigatórios não preenchidos.', erros });
    }

    // Verificar duplicidade de código de barras (somente se foi informado, excluindo o próprio produto)
    if (codigo_barras && codigo_barras.trim() !== '') {
        db.get(`SELECT id FROM produtos WHERE codigo_barras = ? AND id != ?`, [codigo_barras, id], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            if (row) {
                return res.status(400).json({ error: 'Produto com este código de barras já está cadastrado!' });
            }
            atualizarProduto();
        });
    } else {
        atualizarProduto();
    }

    function atualizarProduto() {
        const sql = `UPDATE produtos SET nome = ?, descricao = ?, codigo_barras = ?, quantidade = ?, categoria = ? WHERE id = ?`;
        db.run(sql, [nome, descricao, codigo_barras || null, quantidade || 0, categoria, id], function(err) {
            if (err) return res.status(400).json({ error: 'Erro ao atualizar: ' + err.message });
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Produto não encontrado.' });
            }
            res.json({ message: 'Produto atualizado com sucesso!', id });
        });
    }
};
