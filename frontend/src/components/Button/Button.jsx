import { Link } from 'react-router-dom';
import './Button.css';

// variante: 'principal' (azul) ou 'secundaria' (clara com borda azul).
// Com "to" vira um Link interno; com "href", um link comum; sem eles, um <button>.
function Button({ variante = 'principal', to, href, className = '', children, ...props }) {
    const classes = `botao botao--${variante} ${className}`.trim();

    if (to) {
        return <Link to={to} className={classes} {...props}>{children}</Link>;
    }

    if (href) {
        return <a href={href} className={classes} {...props}>{children}</a>;
    }

    return <button type="button" className={classes} {...props}>{children}</button>;
}

export default Button;
