import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import "./Token.css"; // Arquivo de estilos separado

const USD_TO_BRL = 5.73; // Cotação do dólar

const models = [
    { name: "GPT-4o-mini", input: 0.15, output: 0.60 },
    { name: "GPT-4o", input: 2.50, output: 10.00 },
    { name: "Claude 3.5 Haiku", input: 0.25, output: 1.25 },
    { name: "DeepSeek Chat", input: 0.27, output: 1.10 },
    { name: "Gemini 1.5 Flash", input: 0.07, output: 0.30 },
    { name: "Mistral Small", input: 0.10, output: 0.30 },
    { name: "DeepSeek", input: 3.00, output: 7.00 },
    { name: "Llama 70B", input: 0.54, output: 0.88 },
    { name: "Llama 70B (Servidor)", input: 0.20, output: 0.50 } // Custo menor em execução própria
];

export default function Token() {
    const [tokens, setTokens] = useState(1); // Milhão de tokens (1M padrão)

    return (
        <section className="dashboard-container">
            <Sidebar />
            <div className="dashboard-box">
                <h2 className="title">💰 Cálculo de Custo por Token</h2>

                {/* Seção explicativa sobre tokens */}
                <div className="info-box">
                    <h3>O que é um Token?</h3>
                    <p>
                        Um <b>token</b> é uma unidade mínima de texto que um modelo de IA processa.
                        Pode ser uma palavra, parte de uma palavra ou um símbolo de pontuação.
                        Por exemplo, a frase <i>"Olá, como você está?"</i> pode representar cerca de 5 a 6 tokens.
                    </p>
                    <p>
                        Em média, um chatbot consome entre <b>500 a 1500 tokens</b> por mensagem, dependendo do
                        tamanho da conversa e da complexidade da resposta.
                    </p>
                </div>

                {/* Controle deslizante para alterar o número de tokens */}
                <div className="slider-container">
                    <label>Quantidade de tokens (em milhões): {tokens}M</label>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={tokens}
                        onChange={(e) => setTokens(Number(e.target.value))}
                        className="slider"
                    />
                </div>

                {/* Tabela dinâmica */}
                <table className="dashboard-table">
                    <thead>
                    <tr>
                        <th>Modelo</th>
                        <th>Preço Input (1M)</th>
                        <th>Preço Output (1M)</th>
                        <th>Custo Total (USD)</th>
                        <th>Custo Total (BRL)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {models.map((model, index) => {
                        const totalCostUSD = (model.input + model.output) * tokens;
                        const totalCostBRL = totalCostUSD * USD_TO_BRL;
                        return (
                            <tr key={index}>
                                <td>{model.name}</td>
                                <td>${model.input.toFixed(2)}</td>
                                <td>${model.output.toFixed(2)}</td>
                                <td className="usd-cost">${totalCostUSD.toFixed(2)}</td>
                                <td className="brl-cost">R$ {totalCostBRL.toFixed(2)}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
