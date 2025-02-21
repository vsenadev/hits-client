import { useState, useEffect, useRef } from "react";
import Sidebar from "../../components/Sidebar";
import ReactMarkdown from "react-markdown";
import "./Chat.css"; // CSS atualizado
import { http } from "../../environments/environment";

export default function Chat() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [selectedEmpresa, setSelectedEmpresa] = useState("");
    const [loading, setLoading] = useState(false); // Estado para o loading
    const chatEndRef = useRef(null);
    const [error, setError] = useState("");

    // Buscar empresas do backend
    useEffect(() => {
        const loadEmpresas = async () => {
            try {
                const response = await http.get("v1/enterprise");
                setEmpresas(response.data);
                if (response.data.length > 0) {
                    setSelectedEmpresa(response.data[0].name); // Usa o nome da empresa
                }
            } catch (err) {
                setError("Erro ao carregar empresas");
            }
        };
        loadEmpresas();
    }, []);

    // Scroll automático para a última mensagem
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Enviar mensagem
    const sendMessage = async () => {
        if (!message.trim()) return;

        const newMessages = [...messages, { role: "user", message: message }];
        setMessages(newMessages);
        setMessage("");
        setLoading(true); // Ativa o loading

        try {
            const response = await http.post("v1/chat",
                {
                    empresa: selectedEmpresa.toLowerCase(),
                    question: message,
                    chat_history: newMessages,
                },
                { headers: { "Content-Type": "application/json" } }
            );

            setMessages([...newMessages, { role: "assistant", message: response.data.answer }]);
        } catch (error) {
            setMessages([...newMessages, { role: "assistant", message: "Erro ao obter resposta do bot" }]);
        } finally {
            setLoading(false); // Desativa o loading
        }
    };

    return (
        <section className="chat-container">
            <Sidebar />
            <div className="chat-box">
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.role}`}>
                            {msg.role === "assistant" ? (
                                <ReactMarkdown>{msg.message}</ReactMarkdown>
                            ) : (
                                msg.message
                            )}
                        </div>
                    ))}

                    {loading && <div className="message assistant loading">⏳ Digitando...</div>}

                    <div ref={chatEndRef} />
                </div>

                <div className="chat-input">
                    <select
                        value={selectedEmpresa}
                        onChange={(e) => setSelectedEmpresa(e.target.value)}
                    >
                        {empresas.map((empresa) => (
                            <option key={empresa._id} value={empresa.name}>
                                {empresa.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Digite sua mensagem..."
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    />

                    <button onClick={sendMessage} disabled={loading}>
                        {loading ? "Enviando..." : "Enviar"}
                    </button>
                </div>

                {error && <p className="error-message">{error}</p>}
            </div>
        </section>
    );
}
