import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Associacao() {
    const [produtos, setProdutos] = useState([]);
    const [fornecedores, setFornecedores] = useState([]);
    const [produtoSelecionadoId, setProdutoSelecionadoId] = useState('');
    const [produtoDetalhe, setProdutoDetalhe] = useState(null);
    const [fornecedoresAssociados, setFornecedoresAssociados] = useState([]);
    const [fornecedorId, setFornecedorId] = useState('');

    // Carregar lista de produtos e fornecedores
    useEffect(() => {
        axios.get('http://localhost:3000/produtos').then(res => setProdutos(res.data));
        axios.get('http://localhost:3000/fornecedores').then(res => setFornecedores(res.data));
    }, []);

    // Quando seleciona um produto, carregar detalhes e fornecedores associados
    useEffect(() => {
        if (produtoSelecionadoId) {
            axios.get(`http://localhost:3000/produtos/${produtoSelecionadoId}`)
                .then(res => setProdutoDetalhe(res.data))
                .catch(() => setProdutoDetalhe(null));

            carregarFornecedoresAssociados(produtoSelecionadoId);
        } else {
            setProdutoDetalhe(null);
            setFornecedoresAssociados([]);
        }
    }, [produtoSelecionadoId]);

    const carregarFornecedoresAssociados = (produtoId) => {
        axios.get(`http://localhost:3000/produtos/${produtoId}/fornecedores`)
            .then(res => setFornecedoresAssociados(res.data))
            .catch(() => setFornecedoresAssociados([]));
    };

    // Fornecedores disponíveis (ainda não associados ao produto)
    const fornecedoresDisponiveis = fornecedores.filter(
        f => !fornecedoresAssociados.some(fa => fa.id === f.id)
    );

    const associar = () => {
        if (!produtoSelecionadoId || !fornecedorId) return alert("Selecione um produto e um fornecedor.");

        axios.post('http://localhost:3000/associar', { produto_id: produtoSelecionadoId, fornecedor_id: fornecedorId })
            .then((res) => {
                alert(res.data.message);
                carregarFornecedoresAssociados(produtoSelecionadoId);
                setFornecedorId('');
            })
            .catch(err => alert(err.response?.data?.error || "Erro ao associar."));
    };

    const desassociar = (fornecedorIdToRemove) => {
        if (!window.confirm("Tem certeza que deseja desassociar este fornecedor?")) return;

        axios.delete('http://localhost:3000/associar', {
            data: { produto_id: produtoSelecionadoId, fornecedor_id: fornecedorIdToRemove }
        })
            .then((res) => {
                alert(res.data.message);
                carregarFornecedoresAssociados(produtoSelecionadoId);
            })
            .catch(err => alert(err.response?.data?.error || "Erro ao desassociar."));
    };

    return (
        <div>
            <h1>Associar Produto a Fornecedor</h1>

            {/* Seleção de Produto */}
            <label>Selecione um Produto:</label>
            <select value={produtoSelecionadoId} onChange={(e) => setProdutoSelecionadoId(e.target.value)}>
                <option value="">Selecione um produto</option>
                {produtos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>

            {/* Detalhes do Produto (somente leitura) */}
            {produtoDetalhe && (
                <div style={{border: '1px solid #ccc', padding: '10px', margin: '10px 0', borderRadius: '5px'}}>
                    <h3>Detalhes do Produto</h3>
                    <p><strong>Nome:</strong> {produtoDetalhe.nome}</p>
                    <p><strong>Código de Barras:</strong> {produtoDetalhe.codigo_barras || 'N/A'}</p>
                    <p><strong>Descrição:</strong> {produtoDetalhe.descricao}</p>
                    <p><strong>Categoria:</strong> {produtoDetalhe.categoria}</p>
                    <p><strong>Quantidade:</strong> {produtoDetalhe.quantidade || 0}</p>
                </div>
            )}

            {/* Associar Fornecedor */}
            {produtoDetalhe && (
                <div style={{margin: '10px 0'}}>
                    <label>Associar Fornecedor:</label>
                    <select value={fornecedorId} onChange={(e) => setFornecedorId(e.target.value)}>
                        <option value="">Selecione um fornecedor</option>
                        {fornecedoresDisponiveis.map(f => (
                            <option key={f.id} value={f.id}>{f.nome} (CNPJ: {f.cnpj})</option>
                        ))}
                    </select>
                    <button onClick={associar} style={{marginLeft: '10px'}}>Associar Fornecedor</button>
                </div>
            )}

            {/* Tabela de Fornecedores Associados */}
            {produtoDetalhe && (
                <div style={{margin: '10px 0'}}>
                    <h3>Fornecedores Associados</h3>
                    {fornecedoresAssociados.length === 0 ? (
                        <p>Nenhum fornecedor associado a este produto.</p>
                    ) : (
                        <table border="1" cellPadding="8" cellSpacing="0" style={{borderCollapse: 'collapse', width: '100%'}}>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>CNPJ</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fornecedoresAssociados.map(f => (
                                    <tr key={f.id}>
                                        <td>{f.nome}</td>
                                        <td>{f.cnpj}</td>
                                        <td>
                                            <button onClick={() => desassociar(f.id)}>Desassociar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}

export default Associacao;
