import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Fornecedores() {
    const [fornecedores, setFornecedores] = useState([]);
    const [form, setForm] = useState({ nome: '', cnpj: '', endereco: '', contato: '', telefone: '', email: '' });
    const [erros, setErros] = useState({});
    const [editandoId, setEditandoId] = useState(null);

    const carregarFornecedores = () => {
        axios.get('http://localhost:3000/fornecedores')
            .then(res => setFornecedores(res.data))
            .catch(err => console.error("Erro ao listar fornecedores:", err));
    };

    useEffect(() => {
        carregarFornecedores();
    }, []);

    const limparForm = () => {
        setForm({ nome: '', cnpj: '', endereco: '', contato: '', telefone: '', email: '' });
        setErros({});
        setEditandoId(null);
    };

    const cadastrar = () => {
        setErros({});

        if (editandoId) {
            // Atualizar fornecedor existente
            axios.put(`http://localhost:3000/fornecedores/${editandoId}`, form)
                .then(() => {
                    alert("Fornecedor atualizado com sucesso!");
                    carregarFornecedores();
                    limparForm();
                })
                .catch(err => {
                    const data = err.response?.data;
                    if (data?.erros) {
                        setErros(data.erros);
                    } else if (data?.error) {
                        alert(data.error);
                    }
                });
        } else {
            // Cadastrar novo fornecedor
            axios.post('http://localhost:3000/fornecedores', form)
                .then(() => {
                    alert("Fornecedor cadastrado com sucesso!");
                    carregarFornecedores();
                    limparForm();
                })
                .catch(err => {
                    const data = err.response?.data;
                    if (data?.erros) {
                        setErros(data.erros);
                    } else if (data?.error) {
                        alert(data.error);
                    }
                });
        }
    };

    const excluir = (id) => {
        if (!window.confirm("Tem certeza que deseja excluir este fornecedor?")) return;
        axios.delete(`http://localhost:3000/fornecedores/${id}`)
            .then(() => {
                setFornecedores(fornecedores.filter(f => f.id !== id));
            })
            .catch(err => alert("Erro ao excluir: " + err.message));
    };

    const editar = (fornecedor) => {
        setForm({
            nome: fornecedor.nome || '',
            cnpj: fornecedor.cnpj || '',
            endereco: fornecedor.endereco || '',
            contato: fornecedor.contato || '',
            telefone: fornecedor.telefone || '',
            email: fornecedor.email || ''
        });
        setEditandoId(fornecedor.id);
        setErros({});
    };

    return (
        <div>
            <h1>Gestão de Fornecedores</h1>

            <div>
                <input placeholder="Nome" value={form.nome} onChange={(e) => setForm({...form, nome: e.target.value})} />
                {erros.nome && <span style={{color: 'red', fontSize: '12px', display: 'block'}}>{erros.nome}</span>}
            </div>

            <div>
                <input placeholder="CNPJ" value={form.cnpj} onChange={(e) => setForm({...form, cnpj: e.target.value})} />
                {erros.cnpj && <span style={{color: 'red', fontSize: '12px', display: 'block'}}>{erros.cnpj}</span>}
            </div>

            <div>
                <input placeholder="Endereço" value={form.endereco} onChange={(e) => setForm({...form, endereco: e.target.value})} />
                {erros.endereco && <span style={{color: 'red', fontSize: '12px', display: 'block'}}>{erros.endereco}</span>}
            </div>

            <div>
                <input placeholder="Contato" value={form.contato} onChange={(e) => setForm({...form, contato: e.target.value})} />
                {erros.contato && <span style={{color: 'red', fontSize: '12px', display: 'block'}}>{erros.contato}</span>}
            </div>

            <div>
                <input placeholder="(00) 0000-0000" value={form.telefone} onChange={(e) => setForm({...form, telefone: e.target.value})} />
                {erros.telefone && <span style={{color: 'red', fontSize: '12px', display: 'block'}}>{erros.telefone}</span>}
            </div>

            <div>
                <input placeholder="exemplo@fornecedor.com" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
                {erros.email && <span style={{color: 'red', fontSize: '12px', display: 'block'}}>{erros.email}</span>}
            </div>

            <button onClick={cadastrar}>{editandoId ? 'Atualizar Fornecedor' : 'Cadastrar Fornecedor'}</button>
            {editandoId && <button onClick={limparForm} style={{marginLeft: '10px'}}>Cancelar Edição</button>}

            <h2>Lista de Fornecedores</h2>
            <ul>
                {fornecedores.map(f => (
                    <li key={f.id}>
                        {f.nome} (CNPJ: {f.cnpj}) - Tel: {f.telefone || 'N/A'} - Email: {f.email || 'N/A'}
                        <button onClick={() => editar(f)} style={{marginLeft: '10px'}}>Editar</button>
                        <button onClick={() => excluir(f.id)} style={{marginLeft: '5px'}}>Excluir</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Fornecedores;
