// Símbolo da marca: três círculos ligados em triângulo. É decorativo: o nome "PsyCool" vem ao lado, em texto.
function Logo(props) {
    return (
        <svg viewBox="0 0 57 48" aria-hidden="true" focusable="false" {...props}>
            <g strokeWidth="3" strokeLinecap="round">
                <line x1="28.5" y1="8" x2="7" y2="40" style={{ stroke: 'var(--cor-empresa)' }} />
                <line x1="28.5" y1="8" x2="50" y2="40" style={{ stroke: 'var(--cor-psicologo)' }} />
                <line x1="7" y1="40" x2="50" y2="40" style={{ stroke: 'var(--cor-psicologo)' }} />
            </g>
            <circle cx="28.5" cy="8" r="7.5" style={{ fill: 'var(--cor-empresa)' }} />
            <circle cx="7.5" cy="40" r="7.5" style={{ fill: 'var(--cor-colaborador)' }} />
            <circle cx="49.5" cy="40" r="7.5" style={{ fill: 'var(--cor-psicologo)' }} />
        </svg>
    );
}

export default Logo;
