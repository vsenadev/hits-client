import React, { useState, useEffect } from "react";
import { http } from "../../environments/environment";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import Sidebar from "../../components/Sidebar";

export default function Home() {
    const [empresas, setEmpresas] = useState([]);
    const [selectedEmpresa, setSelectedEmpresa] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [newEmpresa, setNewEmpresa] = useState("");
    const [editEmpresa, setEditEmpresa] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState("");
    const [isUploading, setIsUploading] = useState(false); // Estado de upload
    const [file, setFile] = useState(null); // Estado para armazenar o arquivo

    const navigate = useNavigate();

    const loadEmpresas = async () => {
        try {
            const response = await http.get("v1/enterprise");
            setEmpresas(response.data);
        } catch (err) {
            setError("Erro ao carregar empresas");
        }
    };

    useEffect(() => {
        loadEmpresas();
    }, []);

    const handleSelectEmpresa = async (empresaId) => {
        if (!empresaId) return; // Garantir que o ID da empresa seja válido
        try {
            const response = await http.get(`v1/document/${empresaId}/documents`);
            setDocuments(response.data);
            setSelectedEmpresa(empresaId); // Atualiza o ID da empresa selecionada
        } catch (err) {
            setError("Erro ao carregar documentos");
        }
    };

    const handleAddEmpresa = async () => {
        if (!newEmpresa.trim()) return; // Garantir que o valor não é vazio ou apenas espaços
        try {
            const response = await http.post("v1/enterprise", { name: newEmpresa });
            await loadEmpresas();
            setNewEmpresa("");
        } catch (err) {
            setError("Erro ao adicionar empresa");
        }
    };

    const handleEditEmpresa = async () => {
        if (!editEmpresa.trim() || !selectedEmpresa) return; // Verifica se o campo de edição não está vazio e se uma empresa está selecionada
        try {
            await http.put(`v1/enterprise/${selectedEmpresa}`, { name: editEmpresa }); // Usando selectedEmpresa (_id) aqui
            setEmpresas(
                empresas.map((empresa) =>
                    empresa._id === selectedEmpresa ? { ...empresa, name: editEmpresa } : empresa
                )
            );
            setIsEditing(false);
            setEditEmpresa("");
        } catch (err) {
            setError("Erro ao editar empresa");
        }
    };

    const handleDeleteEmpresa = async (empresaId) => {
        if (!empresaId) return; // Garantir que o ID da empresa seja válido
        try {
            await http.delete(`v1/enterprise/${empresaId}`);
            setEmpresas(empresas.filter((empresa) => empresa._id !== empresaId));
            if (selectedEmpresa === empresaId) {
                setDocuments([]);
                setSelectedEmpresa(null);
            }
        } catch (err) {
            setError("Erro ao excluir empresa");
        }
    };

    const handleUploadFile = async () => {
        if (!file || !selectedEmpresa) return; // Verificar se um arquivo foi selecionado

        setIsUploading(true); // Ativar estado de upload
        const formData = new FormData();
        formData.append("file", file);
        formData.append("filename", file.name);

        try {
            // Envia o arquivo para o backend
            await http.post(`v1/document/${selectedEmpresa}/documents`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data", // Tipo de conteúdo para upload de arquivo
                },
            });
            // Recarregar documentos após o upload
            const response = await http.get(`v1/document/${selectedEmpresa}/documents`);
            setDocuments(response.data);
            setFile(null); // Limpar o estado do arquivo após o upload
        } catch (err) {
            setError("Erro ao enviar arquivo");
        } finally {
            setIsUploading(false); // Desativar o estado de upload
        }
    };

    return (
        <div className="home-container">
            <Sidebar />
            <div className="empresas-list">
                <h1>Empresas</h1>
                {error && <p className="error-message">{error}</p>}
                <div className="empresa-actions">
                    <input
                        type="text"
                        placeholder="Digite o nome da nova empresa"
                        value={newEmpresa}
                        onChange={(e) => setNewEmpresa(e.target.value)}
                        className="empresa-input"
                    />
                    <button onClick={handleAddEmpresa} className="add-btn">Adicionar Empresa</button>
                </div>
                <ul className="empresas">
                    {empresas.map((empresa) => (
                        <li
                            key={empresa._id}
                            className={selectedEmpresa === empresa._id ? "selected" : ""}
                            onClick={() => handleSelectEmpresa(empresa._id)}
                        >
                            <span>{empresa.name}</span>
                            <div className="actions">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsEditing(true);
                                        setEditEmpresa(empresa.name);
                                        setSelectedEmpresa(empresa._id); // Atualizar o selectedEmpresa com o _id
                                    }}
                                >
                                    Editar
                                </button>
                                <button onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteEmpresa(empresa._id)
                                }}>
                                    Excluir
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="documents-container">
                {selectedEmpresa && (
                    <>
                        <h2>Documentos da Empresa</h2>
                        <ul className="documents-list">
                            {documents.map((doc) => (
                                <li key={doc._id}>
                                    {doc.filename} {/* Exibe o nome do arquivo */}
                                </li>
                            ))}
                        </ul>

                        <div className="upload-container">
                            <input
                                type="file"
                                accept=".pdf, .docx"
                                onChange={(e) => setFile(e.target.files[0])}
                                disabled={isUploading} // Desabilita o input enquanto o upload está em andamento
                            />
                            <button
                                onClick={handleUploadFile}
                                disabled={isUploading || !file} // Desabilita o botão enquanto o upload está em andamento
                            >
                                {isUploading ? "Carregando..." : "Enviar Documento"}
                            </button>
                        </div>
                    </>
                )}
                {isEditing && (
                    <div className="edit-empresa">
                        <input
                            type="text"
                            value={editEmpresa}
                            onChange={(e) => setEditEmpresa(e.target.value)}
                            placeholder="Novo nome da empresa"
                            className="empresa-input"
                        />
                        <button onClick={handleEditEmpresa} className="edit-btn">
                            Salvar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
