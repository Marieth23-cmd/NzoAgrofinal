import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// 1. Relatório do usuário logado (com filtros de data opcionais)
export const getRelatorioUsuario = async (dataInicio?: string, dataFim?: string): Promise<any> => {
    try {
        const response = await axios.get(`${API_URL}/relatorios/usuario`, {
            withCredentials: true,
            params: {
                dataInicio,
                dataFim,
            },
        });

        return response.data.relatorio;
    } catch (error: any) {
        console.log("Erro ao buscar relatório do usuário", error.response?.data || error.message);
        throw { mensagem: "Erro ao buscar relatório do usuário" };
    }
};

// 2. Relatório geral (somente para admin)
export const getRelatorioGeral = async (dataInicio?: string, dataFim?: string): Promise<any> => {
    try {
        const response = await axios.get(`${API_URL}/relatorios/geral`, {
            withCredentials: true,
            params: {
                dataInicio,
                dataFim,
            },
        });

        return response.data.relatorio_geral;
    } catch (error: any) {
        console.log("Erro ao buscar relatório geral", error.response?.data || error.message);
        throw { mensagem: "Erro ao buscar relatório geral" };
    }
};

// 3. Estatísticas gerais (somente admin)
export const getEstatisticas = async (): Promise<any> => {
    try {
        const response = await axios.get(`${API_URL}/relatorios/estatisticas`, {
            withCredentials: true,
        });

        return response.data;
    } catch (error: any) {
        console.log("Erro ao buscar estatísticas", error.response?.data || error.message);
        throw { mensagem: "Erro ao buscar estatísticas" };
    }
};

// 4. Exportar PDF
export const exportarPDF = async (): Promise<Blob> => {
    try {
        const response = await axios.get(`${API_URL}/relatorios/exportar/pdf`, {
            withCredentials: true,
            responseType: "blob",
        });

        return response.data;
    } catch (error: any) {
        console.log("Erro ao exportar PDF", error.response?.data || error.message);
        throw { mensagem: "Erro ao exportar PDF" };
    }
};

// 5. Exportar CSV (admin)
export const exportarCSV = async (): Promise<Blob> => {
    try {
        const response = await axios.get(`${API_URL}/relatorios/exportar/csv`, {
            withCredentials: true,
            responseType: "blob",
        });

        return response.data;
    } catch (error: any) {
        console.log("Erro ao exportar CSV", error.response?.data || error.message);
        throw { mensagem: "Erro ao exportar CSV" };
    }
};
