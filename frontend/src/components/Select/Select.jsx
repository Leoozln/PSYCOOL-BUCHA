import './Select.css';

function Select({ label, id, className = '', children, ...props }) {
    return (
        <div className={`select ${className}`.trim()}>
            <label className="select__rotulo" htmlFor={id}>{label}</label>
            <select className="select__campo" id={id} {...props}>{children}</select>
        </div>
    );
}

export default Select;
