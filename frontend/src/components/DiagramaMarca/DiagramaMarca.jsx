import { IconeColaborador, IconeEmpresa, IconePsicologo } from './IconesMarca';
import './DiagramaMarca.css';

const CENTRO = { x: 203, y: 362 };
const TAMANHO_ICONE = 30;

// Coordenadas proporcionais ao painel dos frames do Figma.
const LADOS = [
    { nome: 'Empresa', x: 203, y: 214, rotuloY: 170, cor: 'var(--cor-empresa)', corRotulo: '#A9B7F0', Icone: IconeEmpresa },
    { nome: 'Colaborador', x: 62, y: 436, rotuloY: 495, cor: 'var(--cor-colaborador)', corRotulo: '#F0CFD7', Icone: IconeColaborador },
    { nome: 'Psicólogo', x: 344, y: 436, rotuloY: 495, cor: 'var(--cor-psicologo)', corRotulo: '#D3D8F4', Icone: IconePsicologo },
];

function DiagramaMarca({ className = '' }) {
    const [empresa, colaborador, psicologo] = LADOS;

    return (
        <svg
            className={`diagrama ${className}`.trim()}
            viewBox="8 150 390 352"
            role="img"
            aria-label="Diagrama da marca: Empresa, Colaborador e Psicólogo ligados ao PsyCool, no centro."
        >
            <polygon
                className="diagrama__tracejado"
                points={`${empresa.x},${empresa.y} ${colaborador.x},${colaborador.y} ${psicologo.x},${psicologo.y}`}
            />

            {LADOS.map((lado) => (
                <line
                    key={lado.nome}
                    className="diagrama__ligacao"
                    x1={CENTRO.x}
                    y1={CENTRO.y}
                    x2={lado.x}
                    y2={lado.y}
                    style={{ stroke: lado.cor }}
                />
            ))}

            <circle className="diagrama__anel" cx={CENTRO.x} cy={CENTRO.y} r="55" />
            <circle className="diagrama__centro" cx={CENTRO.x} cy={CENTRO.y} r="48" />
            <text className="diagrama__nome" x={CENTRO.x} y={CENTRO.y} textAnchor="middle" dominantBaseline="central">
                PsyCool
            </text>

            {LADOS.map((lado) => (
                <g key={lado.nome}>
                    <circle cx={lado.x} cy={lado.y} r="36.5" style={{ fill: lado.cor }} />
                    <lado.Icone
                        className="diagrama__icone"
                        x={lado.x - TAMANHO_ICONE / 2}
                        y={lado.y - TAMANHO_ICONE / 2}
                        width={TAMANHO_ICONE}
                        height={TAMANHO_ICONE}
                    />
                    <text className="diagrama__rotulo" x={lado.x} y={lado.rotuloY} textAnchor="middle" style={{ fill: lado.corRotulo }}>
                        {lado.nome}
                    </text>
                </g>
            ))}
        </svg>
    );
}

export default DiagramaMarca;
