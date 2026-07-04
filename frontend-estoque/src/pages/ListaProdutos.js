import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ListaProdutos() {
    const [produtos, setProdutos] = useState([]);

    useEffect(() => {
        // Chamada GET para o seu backend
        axios.get('http://localhost:3000/produtos')
            .then(response => setProdutos(response.data))
            .catch(error => console.error("Erro ao buscar produtos:", error));
    }, []);

    return (
        <div>
            <h1>Listagem de Produtos</h1>
            <ul>
                {produtos.map(p => (
                    <li key={p.id}>{p.nome} - {p.codigo_barras}</li>
                ))}
            </ul>
        </div>
    );
}

// Adicione isto ao seu fornecedorController.js
exports.listarFornecedores = (req, res) => {
    db.all("SELECT * FROM fornecedores", [], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json(rows);
    });
};


export default ListaProdutos;