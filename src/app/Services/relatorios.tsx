import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001";

// Obtém o relatório do usuário específico
export const getRelatorioUsuario = async (id: number): Promise<any> => {
    try {
        const response = await axios.get(`${API_URL}/relatorios/${id}`);
        return response.data;
    } catch (error: any) {
        console.error("Erro ao buscar relatório do usuário", error.response?.data || error.message);
        throw { mensagem: "Erro ao buscar relatório do usuário" };
    }
};

// Obtém o relatório geral (somente para administradores)
export const getRelatorioGeral = async (): Promise<any> => {
    try {
        const response = await axios.get(`${API_URL}/relatorios/geral`);
        return response.data;
    } catch (error: any) {
        console.error("Erro ao buscar relatório geral", error.response?.data || error.message);
        throw { mensagem: "Erro ao buscar relatório geral" };
    }
};
