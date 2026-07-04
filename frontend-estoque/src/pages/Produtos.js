import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CATEGORIAS_PREDEFINIDAS = ['Eletrônicos', 'Alimentos', 'Vestuário', 'Outro'];

function GerenciarProdutos() {
    const [produtos, setProdutos] = useState([]);
    const [form, setForm] = useState({ nome: '', descricao: '', codigo_barras: '', quantidade: '', categoria: '', categoriaCustom: '' });
    const [erros, setErros] = useState({});
    const [editandoId, setEditandoId] = useState(null);

    const carregarProdutos = () => {
        axios.get('http://localhost:3000/produtos')
            .then(res => setProdutos(res.data))
            .catch(err => console.error("Erro ao listar:", err));
    };

    useEffect(() => {
        carregarProdutos();
    }, []);

    const limparForm = () => {
        setForm({ nome: '', descricao: '', codigo_barras: '', quantidade: '', categoria: '', categoriaCustom: '' });
        setErros({});
        setEditandoId(null);
    };

    const getCategoriaFinal = () => {
        if (form.categoria === 'Outro') {
            return form.categoriaCustom;
        }
        return form.categoria;
    };

    const cadastrar = () => {
        setErros({});
        const categoriaFinal = getCategoriaFinal();
        const dados = { ...form, categoria: categoriaFinal };
        delete dados.categoriaCustom;

        if (editandoId) {
            axios.put(`http://localhost:3000/produtos/${editandoId}`, dados)
                .then(() => {
                    alert("Produto atualizado com sucesso!");
                    carregarProdutos();
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
            axios.post('http://localhost:3000/produtos', dados)
                .then(() => {
                    alert("Produto cadastrado com sucesso!");
                    carregarProdutos();
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
        if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;
        axios.delete(`http://localhost:3000/produtos/${id}`)
            .then(() => {
                setProdutos(produtos.filter(p => p.id !== id));
            });
    };

    const editar = (produto) => {
        const categoriaPredefinida = CATEGORIAS_PREDEFINIDAS.includes(produto.categoria);
        setForm({
            nome: produto.nome || '',
            descricao: produto.descricao || '',
            codigo_barras: produto.codigo_barras || '',
            quantidade: produto.quantidade || '',
            categoria: categoriaPredefinida ? produto.categoria : 'Outro',
            categoriaCustom: categoriaPredefinida ? '' : (produto.categoria || '')
        });
        setEditandoId(produto.id);
        setErros({});
    };

    const handleCategoriaChange = (e) => {
        const val = e.target.value;
        setForm({...form, categoria: val, categoriaCustom: val === 'Outro' ? form.categoriaCustom : ''});
    };

    return (
        <div>
            <h2>Cadastro de Produtos</h2>

            <div>
                <input placeholder="Nome" value={form.nome} onChange={(e) => setForm({...form, nome: e.target.value})} />
                {erros.nome && <span style={{color: 'red', fontSize: '12px', display: 'block'}}>{erros.nome}</span>}
            </div>

            <div>
                <input placeholder="Descrição" value={form.descricao} onChange={(e) => setForm({...form, descricao: e.target.value})} />
                {erros.descricao && <span style={{color: 'red', fontSize: '12px', display: 'block'}}>{erros.descricao}</span>}
            </div>

            <div>
                <input placeholder="Código de Barras" value={form.codigo_barras} onChange={(e) => setForm({...form, codigo_barras: e.target.value})} />
            </div>

            <div>
                <input type="number" placeholder="Quantidade" value={form.quantidade} onChange={(e) => setForm({...form, quantidade: e.target.value})} />
            </div>

            <div>
                <select value={form.categoria} onChange={handleCategoriaChange}>
                    <option value="">Selecione uma categoria</option>
                    {CATEGORIAS_PREDEFINIDAS.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                {erros.categoria && <span style={{color: 'red', fontSize: '12px', display: 'block'}}>{erros.categoria}</span>}
            </div>

            {form.categoria === 'Outro' && (
                <div>
                    <input placeholder="Digite a categoria personalizada" value={form.categoriaCustom} onChange={(e) => setForm({...form, categoriaCustom: e.target.value})} />
                </div>
            )}

            <button onClick={cadastrar}>{editandoId ? 'Atualizar Produto' : 'Salvar Produto'}</button>
            {editandoId && <button onClick={limparForm} style={{marginLeft: '10px'}}>Cancelar Edição</button>}

            <h3>Lista de Produtos</h3>
            <ul>
                {produtos.map(p => (
                    <li key={p.id}>
                        {p.nome} - {p.codigo_barras || 'Sem código'} - Categoria: {p.categoria} - Qtd: {p.quantidade || 0}
                        <button onClick={() => editar(p)} style={{marginLeft: '10px'}}>Editar</button>
                        <button onClick={() => excluir(p.id)} style={{marginLeft: '5px'}}>Excluir</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default GerenciarProdutos;
