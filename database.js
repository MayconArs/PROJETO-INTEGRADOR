const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./estoque.db');

db.serialize(() => {
    // 1. Criar as tabelas principais primeiro
    db.run(`CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        descricao TEXT,
        codigo_barras TEXT UNIQUE,
        quantidade INTEGER,
        categoria TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS fornecedores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        cnpj TEXT UNIQUE,
        endereco TEXT,
        contato TEXT,
        telefone TEXT,
        email TEXT
    )`);

    // Adicionar colunas telefone e email caso a tabela ja exista sem elas
    db.run(`ALTER TABLE fornecedores ADD COLUMN telefone TEXT`, () => {});
    db.run(`ALTER TABLE fornecedores ADD COLUMN email TEXT`, () => {});

    // 2. Criar a tabela de associacao por ultimo (porque ela depende das duas acima)
    db.run(`CREATE TABLE IF NOT EXISTS produto_fornecedor (
        produto_id INTEGER,
        fornecedor_id INTEGER,
        FOREIGN KEY (produto_id) REFERENCES produtos(id),
        FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id),
        PRIMARY KEY (produto_id, fornecedor_id)
    )`);
});

module.exports = db;
