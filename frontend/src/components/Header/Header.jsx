import { Link } from 'react-router-dom';
import Logo from '../Logo/Logo';
import './Header.css';

function Header() {
    return (
        <header className="cabecalho">
            <Link to="/" className="cabecalho__marca">
                <Logo className="cabecalho__logo" />
                <span>PsyCool</span>
            </Link>
        </header>
    );
}

export default Header;
