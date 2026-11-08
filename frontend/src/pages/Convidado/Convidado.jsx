import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import DiagramaMarca from '../../components/DiagramaMarca/DiagramaMarca';
import { IconeColaborador, IconeEmpresa, IconePsicologo } from '../../components/DiagramaMarca/IconesMarca';
import Header from '../../components/Header/Header';
import Logo from '../../components/Logo/Logo';
import { API_URL } from '../../services/api';
import './Convidado.css';

const LADOS = [
    {
        nome: 'Empresa',
        classe: 'empresa',
        Icone: IconeEmpresa,
        papel: 'Contrata o convênio e oferece o benefício à equipe.',
        beneficios: [
            'Um benefício de saúde mental para toda a equipe',
            'Atendimento online, sem deslocamento dos colaboradores',
            'Convênio reunido em uma única plataforma',
        ],
    },
    {
        nome: 'Colaborador',
        classe: 'colaborador',
        Icone: IconeColaborador,
        papel: 'Usa o benefício e faz as consultas online.',
        beneficios: [
            'Acesso a psicólogos pelo convênio da empresa',
            'Consultas online, de onde estiver',
            'Escolha do profissional pelo perfil e pela especialidade',
        ],
    },
    {
        nome: 'Psicólogo',
        classe: 'psicologo',
        Icone: IconePsicologo,
        papel: 'Faz o cadastro, passa pela análise e atende pela plataforma.',
        beneficios: [
            'Novos pacientes vindos das empresas conveniadas',
            'Agenda de consultas dentro da plataforma',
            'Cadastro com análise dos dados e do CRP',
        ],
    },
];

function Convidado() {
    return (
        <div className="convidado">
            <Header />

            <main>
                <section className="convidado__abertura">
                    <div className="convidado__abertura-texto">
                        <h1 className="convidado__titulo">Cuidar da saúde mental também é parte do trabalho.</h1>
                        <p className="convidado__descricao">
                            O PsyCool é uma plataforma de convênio de psicologia online. Ela conecta empresas
                            que querem cuidar das suas equipes, colaboradores que buscam atendimento e psicólogos
                            que querem atender mais pessoas.
                        </p>
                        <div className="convidado__acoes">
                            <Button to="/cadastro/psicologo">Sou psicólogo, quero me cadastrar</Button>
                            <Button variante="secundaria" href={API_URL + '/auth/google'}>Entrar</Button>
                        </div>
                    </div>
                    <Logo className="convidado__simbolo" />
                </section>

                <section className="convidado__lados" aria-labelledby="titulo-lados">
                    <div className="convidado__painel">
                        <h2 className="convidado__painel-titulo" id="titulo-lados">
                            Três lados.<br />Uma só plataforma.
                        </h2>
                        <DiagramaMarca className="convidado__diagrama" />
                    </div>

                    <div className="convidado__papeis textura-pontilhada">
                        <Card className="convidado__papeis-card">
                            <h3 className="convidado__papeis-titulo">Como cada lado participa</h3>
                            <dl className="convidado__papeis-lista">
                                {LADOS.map((lado) => (
                                    <div key={lado.nome} className={`convidado__lado--${lado.classe}`}>
                                        <dt className="convidado__papel-nome">{lado.nome}</dt>
                                        <dd>{lado.papel}</dd>
                                    </div>
                                ))}
                            </dl>
                        </Card>
                    </div>
                </section>

                <section className="convidado__beneficios textura-pontilhada" aria-labelledby="titulo-beneficios">
                    <div className="convidado__beneficios-conteudo">
                        <h2 className="convidado__beneficios-titulo" id="titulo-beneficios">O que cada lado ganha</h2>
                        <div className="convidado__beneficios-grade">
                            {LADOS.map((lado) => (
                                <Card key={lado.nome} className={`convidado__beneficio convidado__lado--${lado.classe}`}>
                                    <div className="convidado__beneficio-topo">
                                        <span className="convidado__beneficio-icone">
                                            <lado.Icone width="30" height="30" />
                                        </span>
                                        <h3>{lado.nome}</h3>
                                    </div>
                                    <ul className="convidado__beneficio-lista">
                                        {lado.beneficios.map((beneficio) => (
                                            <li key={beneficio}>{beneficio}</li>
                                        ))}
                                    </ul>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Convidado;
