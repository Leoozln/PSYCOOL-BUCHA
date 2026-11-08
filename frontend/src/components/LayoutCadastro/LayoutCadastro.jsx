import Card from '../Card/Card';
import DiagramaMarca from '../DiagramaMarca/DiagramaMarca';
import Logo from '../Logo/Logo';
import './LayoutCadastro.css';

const ETAPAS = ['Google', 'Dados', 'Docs', 'Análise'];

function estadoDaEtapa(indice, etapaAtual) {
    if (indice === etapaAtual) {
        return 'atual';
    }

    return indice < etapaAtual ? 'concluida' : 'pendente';
}

// etapaAtual: posição da etapa em ETAPAS (0 a 3).
function LayoutCadastro({ titulo, etapaAtual, children }) {
    return (
        <div className="layout-cadastro">
            <div className="layout-cadastro__moldura">
                <aside className="layout-cadastro__painel">
                    <p className="layout-cadastro__frase">Três lados.<br />Uma só plataforma.</p>
                    <DiagramaMarca className="layout-cadastro__diagrama" />
                </aside>

                <main className="layout-cadastro__conteudo textura-pontilhada">
                    <Card className="layout-cadastro__card">
                        <Logo className="layout-cadastro__logo" />
                        <h1 className="layout-cadastro__titulo">Área do profissional<br />{titulo}</h1>

                        {children}

                        <ol className="layout-cadastro__etapas">
                            {ETAPAS.map((nome, indice) => (
                                <li
                                    key={nome}
                                    className={`layout-cadastro__etapa layout-cadastro__etapa--${estadoDaEtapa(indice, etapaAtual)}`}
                                    aria-current={indice === etapaAtual ? 'step' : undefined}
                                >
                                    {nome}
                                </li>
                            ))}
                        </ol>
                    </Card>
                </main>
            </div>
        </div>
    );
}

export default LayoutCadastro;
