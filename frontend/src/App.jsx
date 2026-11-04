import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

/* Importa a tela de cadastro de psicólogo. Assim, podemos utilizar essa tela dentro do App. */

import CadastroPsicologo from './pages/CadastroPsicologo/CadastroPsicologo';
import Agenda from './pages/Agenda/Agenda';

// Cria o componente principal da aplicação React.
function App() {
    // O return define o que será exibido na tela.
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/agenda" />} />
                <Route path="/cadastro-psicologo" element={<CadastroPsicologo />} />
                <Route path="/agenda" element={<Agenda />} />
            </Routes>
        </BrowserRouter>
    );
}

// Exporta o componente App para que outros arquivos possam importá-lo, como a estrutura principal do React.
export default App;