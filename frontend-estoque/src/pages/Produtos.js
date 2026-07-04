import React, { useState, useEffect } from 'react';
import axios from 'axios';

function GerenciarProdutos() {
    const [produtos, setProdutos] = useState([]);
    // Estado para o formulário completo
    const [form, setForm] = useState({ nome: '', descricao: '', codigo_barras: '', quantidade: '', categoria: '' });

    // 1. Carregar lista ao iniciar
    const carregarProdutos = () => {
        axios.get('http://localhost:3000/produtos')
            .then(res => setProdutos(res.data))
            .catch(err => console.error("Erro ao listar:", err));
    };

    useEffect(() => {
        carregarProdutos();
    }, []);

    // 2. Cadastrar Produto (POST)
    const cadastrar = () => {
        axios.post('http://localhost:3000/produtos', form)
            .then(() => {
                alert("Produto cadastrado!");
                carregarProdutos(); // Recarrega a lista automaticamente
                setForm({ nome: '', descricao: '', codigo_barras: '', quantidade: '', categoria: '' }); // Limpa form
            })
            .catch(err => alert("Erro ao cadastrar: " + err.response?.data?.error));
    };

    // 3. Excluir Produto (DELETE)
    const excluir = (id) => {
        axios.delete(`http://localhost:3000/produtos/${id}`)
            .then(() => {
                setProdutos(produtos.filter(p => p.id !== id));
            });
    };

    return (
        <div>
            <h2>Cadastro de Produtos</h2>
            <input placeholder="Nome" value={form.nome} onChange={(e) => setForm({...form, nome: e.target.value})} />
            <input placeholder="Descrição" value={form.descricao} onChange={(e) => setForm({...form, descricao: e.target.value})} />
            <input placeholder="Código de Barras" value={form.codigo_barras} onChange={(e) => setForm({...form, codigo_barras: e.target.value})} />
            <input type="number" placeholder="Quantidade" value={form.quantidade} onChange={(e) => setForm({...form, quantidade: e.target.value})} />
            <input placeholder="Categoria" value={form.categoria} onChange={(e) => setForm({...form, categoria: e.target.value})} />
            
            <button onClick={cadastrar}>Salvar Produto</button>

            <h3>Lista de Produtos</h3>
            <ul>
                {produtos.map(p => (
                    <li key={p.id}>
                        {p.nome} - {p.codigo_barras} 
                        <button onClick={() => excluir(p.id)}>Excluir</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default GerenciarProdutos;