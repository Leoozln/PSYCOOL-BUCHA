// Símbolo da marca: três círculos ligados em triângulo. É decorativo: o nome "PsyCool" vem ao lado, em texto.
// Cada linha tem a cor de quem "envia": Empresa → Colaborador, Psicólogo → Empresa e Colaborador → Psicólogo.
function Logo(props) {
    return (
        <svg viewBox="0 0 100 90" aria-hidden="true" focusable="false" {...props}>
            <g strokeWidth="6" strokeLinecap="round">
                <line x1="50" y1="18" x2="20" y2="70" style={{ stroke: 'var(--cor-empresa)' }} />
                <line x1="80" y1="70" x2="50" y2="18" style={{ stroke: 'var(--cor-psicologo)' }} />
                <line x1="20" y1="70" x2="80" y2="70" style={{ stroke: 'var(--cor-colaborador)' }} />
            </g>
            <circle cx="50" cy="18" r="13" style={{ fill: 'var(--cor-empresa)' }} />
            <circle cx="20" cy="70" r="13" style={{ fill: 'var(--cor-colaborador)' }} />
            <circle cx="80" cy="70" r="13" style={{ fill: 'var(--cor-psicologo)' }} />
        </svg>
    );
}

export default Logo;
