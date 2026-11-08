// Ícones dos três lados. Usam currentColor, então a cor vem de quem os renderiza.
function IconeBase({ children, ...props }) {
    return (
        <svg
            viewBox="-16 -16 32 32"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
            {...props}
        >
            {children}
        </svg>
    );
}

export function IconeEmpresa(props) {
    return (
        <IconeBase {...props}>
            <circle cx="-3.5" cy="-5" r="4.5" />
            <path d="M-12 10V8a6 6 0 0 1 6-6h5a6 6 0 0 1 6 6v2" />
            <path d="M5 -9.3a4.5 4.5 0 0 1 0 8.6" />
            <path d="M9 2.4A6 6 0 0 1 12.5 8v2" />
        </IconeBase>
    );
}

export function IconeColaborador(props) {
    return (
        <IconeBase {...props}>
            <polyline points="-12,0 -6,0 -2.5,-9 2.5,9 6,0 12,0" />
        </IconeBase>
    );
}

export function IconePsicologo(props) {
    return (
        <IconeBase {...props}>
            <path d="M0 -9 13 -3 0 3 -13 -3Z" fill="currentColor" />
            <path d="M-7.5 1V6c0 3.5 15 3.5 15 0V1" />
            <path d="M13 -3V4" />
        </IconeBase>
    );
}
