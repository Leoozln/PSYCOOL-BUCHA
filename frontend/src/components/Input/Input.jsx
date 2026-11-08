import './Input.css';

function Input({ label, id, className = '', ...props }) {
    return (
        <div className={`input ${className}`.trim()}>
            <label className="input__rotulo" htmlFor={id}>{label}</label>
            <div className="input__caixa">
                <input className="input__campo" id={id} {...props} />
                {props.readOnly && (
                    <svg className="input__cadeado" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                        <rect x="3" y="7" width="10" height="7" rx="1.5" />
                        <path d="M5 7V5a3 3 0 0 1 6 0v2" />
                    </svg>
                )}
            </div>
        </div>
    );
}

export default Input;
