import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Associacao() {
    const [produtos, setProdutos] = useState([]);
    const [fornecedores, setFornecedores] = useState([]);
    const [produtoId, setProdutoId] = useState('');
    const [fornecedorId, setFornecedorId] = useState('');

    // Carrega dados iniciais para os selects
    useEffect(() => {
        axios.get('http://localhost:3000/produtos').then(res => setProdutos(res.data));
        axios.get('http://localhost:3000/fornecedores').then(res => setFornecedores(res.data));
    }, []);

    const associar = () => {
        if (!produtoId || !fornecedorId) return alert("Selecione um produto e um fornecedor.");

        axios.post('http://localhost:3000/associar', { produto_id: produtoId, fornecedor_id: fornecedorId })
            .then(() => alert("Associação realizada com sucesso!"))
            .catch(err => alert("Erro ao associar: " + err.response?.data?.error));
    };

    return (
        <div>
            <h1>Associar Produto a Fornecedor</h1>
            
            <label>Produto:</label>
            <select onChange={(e) => setProdutoId(e.target.value)}>
                <option value="">Selecione um produto</option>
                {produtos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>

            <label>Fornecedor:</label>
            <select onChange={(e) => setFornecedorId(e.target.value)}>
                <option value="">Selecione um fornecedor</option>
                {fornecedores.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
            </select>

            <button onClick={associar}>Confirmar Associação</button>
        </div>
    );
}

export default Associacao;