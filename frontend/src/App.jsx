import { BrowserRouter, Routes, Route } from 'react-router-dom';

/* Importa a tela de cadastro de psicólogo. Assim, podemos utilizar essa tela dentro do App. */

import CadastroPsicologo from './pages/CadastroPsicologo';

// Cria o componente principal da aplicação React.
function App() {
    // O return define o que será exibido na tela.
    return (
        <BrowserRouter>
            <Header />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/pessoas" element={<Pessoas />} />
                <Route path="/cargos" element={<Cargos />} />
            </Routes>

            <Footer />
        </BrowserRouter>
    );
}

// Exporta o componente App para que outros arquivos possam importá-lo, como a estrutura principal do React.
export default App;