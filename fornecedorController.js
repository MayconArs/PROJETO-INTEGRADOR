const db = require('./database');

// Cadastrar Fornecedor
exports.cadastrarFornecedor = (req, res) => {
    const { nome, cnpj, endereco, contato, telefone, email } = req.body;

    // Validação de campos obrigatórios
    const erros = {};
    if (!nome || nome.trim() === '') erros.nome = 'O campo Nome é obrigatório.';
    if (!cnpj || cnpj.trim() === '') erros.cnpj = 'O campo CNPJ é obrigatório.';
    if (!endereco || endereco.trim() === '') erros.endereco = 'O campo Endereço é obrigatório.';
    if (!contato || contato.trim() === '') erros.contato = 'O campo Contato é obrigatório.';
    if (!telefone || telefone.trim() === '') erros.telefone = 'O campo Telefone é obrigatório.';
    if (!email || email.trim() === '') erros.email = 'O campo E-mail é obrigatório.';

    if (Object.keys(erros).length > 0) {
        return res.status(400).json({ error: 'Campos obrigatórios não preenchidos.', erros });
    }

    // Verificar duplicidade de CNPJ
    db.get(`SELECT id FROM fornecedores WHERE cnpj = ?`, [cnpj], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) {
            return res.status(400).json({ error: 'Fornecedor com esse CNPJ já está cadastrado!' });
        }

        const sql = `INSERT INTO fornecedores (nome, cnpj, endereco, contato, telefone, email) VALUES (?, ?, ?, ?, ?, ?)`;

        db.run(sql, [nome, cnpj, endereco, contato, telefone, email], function(err) {
            if (err) {
                return res.status(400).json({ error: 'Erro ao cadastrar fornecedor: ' + err.message });
            }
            res.status(201).json({ message: 'Fornecedor cadastrado com sucesso!', id: this.lastID });
        });
    });
};

// Listar Fornecedores
exports.listarFornecedores = (req, res) => {
    db.all("SELECT * FROM fornecedores", [], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json(rows);
    });
};

// Excluir Fornecedor
exports.excluirFornecedor = (req, res) => {
    const { id } = req.params;
    // Primeiro, remover associações na tabela produto_fornecedor
    db.run(`DELETE FROM produto_fornecedor WHERE fornecedor_id = ?`, [id], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        db.run(`DELETE FROM fornecedores WHERE id = ?`, [id], function(err) {
            if (err) return res.status(400).json({ error: err.message });
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Fornecedor não encontrado.' });
            }
            res.json({ message: 'Fornecedor excluído com sucesso!' });
        });
    });
};

// Atualizar Fornecedor
exports.atualizarFornecedor = (req, res) => {
    const { id } = req.params;
    const { nome, cnpj, endereco, contato, telefone, email } = req.body;

    // Validação de campos obrigatórios
    const erros = {};
    if (!nome || nome.trim() === '') erros.nome = 'O campo Nome é obrigatório.';
    if (!cnpj || cnpj.trim() === '') erros.cnpj = 'O campo CNPJ é obrigatório.';
    if (!endereco || endereco.trim() === '') erros.endereco = 'O campo Endereço é obrigatório.';
    if (!contato || contato.trim() === '') erros.contato = 'O campo Contato é obrigatório.';
    if (!telefone || telefone.trim() === '') erros.telefone = 'O campo Telefone é obrigatório.';
    if (!email || email.trim() === '') erros.email = 'O campo E-mail é obrigatório.';

    if (Object.keys(erros).length > 0) {
        return res.status(400).json({ error: 'Campos obrigatórios não preenchidos.', erros });
    }

    // Verificar se o CNPJ já pertence a outro fornecedor
    db.get(`SELECT id FROM fornecedores WHERE cnpj = ? AND id != ?`, [cnpj, id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) {
            return res.status(400).json({ error: 'Fornecedor com esse CNPJ já está cadastrado!' });
        }

        const sql = `UPDATE fornecedores SET nome = ?, cnpj = ?, endereco = ?, contato = ?, telefone = ?, email = ? WHERE id = ?`;
        db.run(sql, [nome, cnpj, endereco, contato, telefone, email, id], function(err) {
            if (err) return res.status(400).json({ error: 'Erro ao atualizar fornecedor: ' + err.message });
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Fornecedor não encontrado.' });
            }
            res.json({ message: 'Fornecedor atualizado com sucesso!', id });
        });
    });
};
