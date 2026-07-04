import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Fornecedores() {
    const [fornecedores, setFornecedores] = useState([]);
    const [form, setForm] = useState({ nome: '', cnpj: '', endereco: '', contato: '' });

    // Carregar fornecedores ao abrir a página
    const carregarFornecedores = () => {
        axios.get('http://localhost:3000/fornecedores')
            .then(res => setFornecedores(res.data))
            .catch(err => console.error("Erro ao listar fornecedores:", err));
    };

    useEffect(() => {
        carregarFornecedores();
    }, []);

    // Cadastrar Fornecedor
    const cadastrar = () => {
        axios.post('http://localhost:3000/fornecedores', form)
            .then(() => {
                alert("Fornecedor cadastrado com sucesso!");
                carregarFornecedores(); // Atualiza a lista
                setForm({ nome: '', cnpj: '', endereco: '', contato: '' }); // Limpa o formulário
            })
            .catch(err => alert("Erro ao cadastrar: " + err.response?.data?.error));
    };

    // Excluir Fornecedor
    const excluir = (id) => {
        axios.delete(`http://localhost:3000/fornecedores/${id}`)
            .then(() => {
                setFornecedores(fornecedores.filter(f => f.id !== id));
            })
            .catch(err => alert("Erro ao excluir: " + err.message));
    };

    return (
        <div>
            <h1>Gestão de Fornecedores</h1>
            
            <input placeholder="Nome" value={form.nome} onChange={(e) => setForm({...form, nome: e.target.value})} />
            <input placeholder="CNPJ" value={form.cnpj} onChange={(e) => setForm({...form, cnpj: e.target.value})} />
            <input placeholder="Endereço" value={form.endereco} onChange={(e) => setForm({...form, endereco: e.target.value})} />
            <input placeholder="Contato" value={form.contato} onChange={(e) => setForm({...form, contato: e.target.value})} />
            
            <button onClick={cadastrar}>Cadastrar Fornecedor</button>

            <ul>
                {fornecedores.map(f => (
                    <li key={f.id}>
                        {f.nome} (CNPJ: {f.cnpj})
                        <button onClick={() => excluir(f.id)}>Excluir</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Fornecedores;