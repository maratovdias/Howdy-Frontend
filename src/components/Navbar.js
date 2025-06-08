import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav>
            <ul>
                <li><Link to="/">Главная</Link></li>
                <li><Link to="/chat">Чат</Link></li>
                {/* Другие пункты меню */}
            </ul>
        </nav>
    );
}

export default Navbar;
