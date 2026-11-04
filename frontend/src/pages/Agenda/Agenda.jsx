import { useEffect, useState } from 'react';
import API_URL from '../../services/api';
import './Agenda.css';

// Tela que lista os horários da agenda vindos do back-end.
function Agenda() {
    const [agendas, setAgendas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');

    // Busca a agenda no back-end assim que a tela é aberta.
    useEffect(() => {
        async function carregarAgendas() {
            try {
                const resposta = await fetch(`${API_URL}/agenda`);

                if (!resposta.ok) {
                    throw new Error(`Erro ${resposta.status} ao buscar a agenda.`);
                }

                const dados = await resposta.json();
                setAgendas(dados);
            } catch (e) {
                setErro(e.message);
            } finally {
                setCarregando(false);
            }
        }

        carregarAgendas();
    }, []);

    return (
        <div>
            <h1>Agenda</h1>

            {carregando && <p>Carregando...</p>}

            {erro && <p>Não foi possível carregar a agenda: {erro}</p>}

            {!carregando && !erro && agendas.length === 0 && (
                <p>Nenhum horário cadastrado na agenda.</p>
            )}

            <ul>
                {agendas.map((agenda) => (
                    <li key={agenda.id_agenda}>
                        {new Date(agenda.datahora_agenda).toLocaleString('pt-BR')} - {agenda.status_agenda}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Agenda;
