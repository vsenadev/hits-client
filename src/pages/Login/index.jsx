import { useState } from "react";
import { http } from "../../environments/environment";
import "./Login.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // Estado para mensagens de erro
    const [loading, setLoading] = useState(false); // Estado para loading

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // Limpa erro antes da nova tentativa
        setLoading(true); // Ativa o loading

        try {
            const response = await http.put("v1/login", {
                user: email,
                password: password
            });

            if (response.data.token) {
                localStorage.setItem("token", response.data.token); // Salva o token
                window.location.href = "/home"; // Redireciona para a página home
            }
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setError("Usuário não encontrado. Verifique suas credenciais.");
            } else {
                setError("Erro ao fazer login. Tente novamente.");
            }
        } finally {
            setLoading(false); // Desativa o loading após a requisição
        }
    };

    return (
        <section className="login-container">
            <div className="login-box">
                <h1>Login</h1>
                {error && <p className="error-message">{error}</p>} {/* Exibe erro */}
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="text"
                            placeholder="Digite seu email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading} // Desativa input durante requisição
                        />
                    </div>
                    <div className="input-group">
                        <label>Senha</label>
                        <input
                            type="password"
                            placeholder="Digite sua senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading} // Desativa input durante requisição
                        />
                    </div>
                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? "Carregando..." : "ENTRAR"}
                    </button>
                </form>
            </div>
        </section>
    );
}
