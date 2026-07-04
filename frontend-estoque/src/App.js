import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Produtos from './pages/Produtos'; // Você criará esses arquivos
import Fornecedores from './pages/Fornecedores';
import Associacao from './pages/Associacao';

function App() {
    return (
        <Router>
            <nav>
                <Link to="/">Produtos</Link> | 
                <Link to="/fornecedores"> Fornecedores</Link> | 
                <Link to="/associacao"> Associação</Link>
            </nav>

            <Routes>
                <Route path="/" element={<Produtos />} />
                <Route path="/fornecedores" element={<Fornecedores />} />
                <Route path="/associacao" element={<Associacao />} />
            </Routes>
        </Router>
    );
}

export default App;