import './Card.css';

function Card({ className = '', children, ...props }) {
    return <div className={`cartao ${className}`.trim()} {...props}>{children}</div>;
}

export default Card;
