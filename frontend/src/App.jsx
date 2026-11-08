import { BrowserRouter, Routes, Route} from 'react-router-dom';

/* Importa a tela de cadastro de psicólogo. Assim, podemos utilizar essa tela dentro do App. */

import CadastroPsicologo from './pages/CadastroPsicologo/CadastroPsicologo';
import Agenda from './pages/Agenda/Agenda';
import Convidado from './pages/Convidado/Convidado';
import CadastroEnviado from './pages/CadastroEnviado/CadastroEnviado';
import TermoAdesao from './pages/TermoAdesao/TermoAdesao';
import TermosUso from './pages/TermosUso/TermosUso';
import PoliticaPrivacidade from './pages/PoliticaPrivacidade/PoliticaPrivacidade';

// Cria o componente principal da aplicação React.
function App() {
    // O return define o que será exibido na tela.
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Convidado />} />
                <Route path="/cadastro/psicologo" element={<CadastroPsicologo />} />
                <Route path="/psicologo/agenda" element={<Agenda />} />
                <Route path="/cadastro/psicologo/enviado" element={<CadastroEnviado />} />
                <Route path="/termo-de-adesao" element={<TermoAdesao />} />
                <Route path="/termos-de-uso" element={<TermosUso />} />
                <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
            </Routes>
        </BrowserRouter>
    );
}

// Exporta o componente App para que outros arquivos possam importá-lo, como a estrutura principal do React.
export default App;