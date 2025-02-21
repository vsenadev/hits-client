import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa o hook useNavigate
import "./Sidebar.css";
import { FiMenu, FiX, FiBriefcase, FiMessageCircle, FiKey } from "react-icons/fi";

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate(); // Inicializa o hook useNavigate

    // Função para alternar a sidebar no mobile
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    // Função para navegação dos itens
    const handleNavigation = (route) => {
        setIsOpen(false); // Fecha a sidebar quando um item for clicado
        navigate(route);   // Redireciona para a rota desejada
    };

    return (
        <>
            {/* Ícone do menu hambúrguer no mobile */}
            <button className="menu-btn mobile-only" onClick={toggleSidebar}>
                {isOpen ? <FiX size={24} color="black" /> : <FiMenu size={24} color="black" />}
            </button>

            <nav className={`sidebar ${isOpen ? "open" : ""}`} onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
                <ul className="menu">
                    {/* Enterprise vai para /home */}
                    <li onClick={() => handleNavigation("/home")}>
                        <FiBriefcase size={24} />
                        <span className={`menu-text ${isOpen ? "visible" : ""}`}>Enterprise</span>
                    </li>
                    {/* Chat vai para /chat */}
                    <li onClick={() => handleNavigation("/chat")}>
                        <FiMessageCircle size={24} />
                        <span className={`menu-text ${isOpen ? "visible" : ""}`}>Chat</span>
                    </li>
                    {/* Token vai para /token */}
                    {/*<li onClick={() => handleNavigation("/token")}>*/}
                    {/*    <FiKey size={24} />*/}
                    {/*    <span className={`menu-text ${isOpen ? "visible" : ""}`}>Token</span>*/}
                    {/*</li>*/}
                </ul>
            </nav>
        </>
    );
}
