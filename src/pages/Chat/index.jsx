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
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);
    const [error, setError] = useState("");
    const [showReferences, setShowReferences] = useState(false); // Estado do Chevron

    useEffect(() => {
        const loadEmpresas = async () => {
            try {
                const response = await http.get("v1/enterprise");
                setEmpresas(response.data);
                if (response.data.length > 0) {
                    setSelectedEmpresa(response.data[0].name);
                }
            } catch (err) {
                setError("Erro ao carregar empresas");
            }
        };
        loadEmpresas();
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (!message.trim()) return;

        const newMessages = [...messages, { role: "user", message: message }];
        setMessages(newMessages);
        setMessage("");
        setLoading(true);

        try {
            const response = await http.post(
                "v1/chat",
                {
                    empresa: selectedEmpresa.toLowerCase(),
                    question: message,
                    chat_history: newMessages,
                },
                { headers: { "Content-Type": "application/json" } }
            );

            setMessages([
                ...newMessages,
                { role: "assistant", message: response.data.answer, documents: response.data.documents },
            ]);
        } catch (error) {
            setMessages([...newMessages, { role: "assistant", message: "Erro ao obter resposta do bot" }]);
        } finally {
            setLoading(false);
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
                                <>
                                    <ReactMarkdown>{msg.message}</ReactMarkdown>

                                    {/* Chevron para expandir as referências */}
                                    {msg.documents && msg.documents.length > 0 && (
                                        <div className="references">
                                            <button
                                                className="chevron"
                                                onClick={() => setShowReferences(!showReferences)}
                                            >
                                                {showReferences ? "▼ Referências" : "▶ Referências"}
                                            </button>

                                            {showReferences && (
                                                <ul className="references-list">
                                                    {msg.documents.map((doc, docIndex) => (
                                                        <li key={docIndex}>
                                                            📄 {doc.metadata.source.split('/').pop()} - Página {doc.metadata.page + 1}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    )}
                                </>
                            ) : (
                                msg.message
                            )}
                        </div>
                    ))}

                    {loading && <div className="message assistant loading">⏳ Digitando...</div>}

                    <div ref={chatEndRef} />
                </div>

                <div className="chat-input">
                    <select value={selectedEmpresa} onChange={(e) => setSelectedEmpresa(e.target.value)}>
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
