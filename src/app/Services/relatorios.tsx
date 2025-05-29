import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

// ===== ESTATÍSTICAS =====

// Estatísticas gerais (admin)
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

// Estatísticas de vendas (admin)
export const getEstatisticasVendas = async (): Promise<any> => {
    try {
        const response = await axios.get(`${API_URL}/relatorios/estatisticas/vendas`, {
            withCredentials: true,
        });

        return response.data;
    } catch (error: any) {
        console.log("Erro ao buscar estatísticas de vendas", error.response?.data || error.message);
        throw { mensagem: "Erro ao buscar estatísticas de vendas" };
    }
};

// Estatísticas de vendas do fornecedor
export const getEstatisticasVendasFornecedor = async (): Promise<any> => {
    try {
        const response = await axios.get(`${API_URL}/relatorios/estatisticas/vendas/fornecedor`, {
            withCredentials: true,
        });

        return response.data;
    } catch (error: any) {
        console.log("Erro ao buscar estatísticas de vendas do fornecedor", error.response?.data || error.message);
        throw { mensagem: "Erro ao buscar estatísticas de vendas do fornecedor" };
    }
};

// Estatísticas de compras do comprador
export const getEstatisticasComprasComprador = async (): Promise<any> => {
    try {
        const response = await axios.get(`${API_URL}/relatorios/estatisticas/compras/comprador`, {
            withCredentials: true,
        });

        return response.data;
    } catch (error: any) {
        console.log("Erro ao buscar estatísticas de compras do comprador", error.response?.data || error.message);
        throw { mensagem: "Erro ao buscar estatísticas de compras do comprador" };
    }
};

// ===== RELATÓRIOS =====

// Relatório geral (admin)
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

// Relatório de vendas (admin)
export const getRelatoriaVendas = async (dataInicial?: string, dataFinal?: string): Promise<any> => {
    try {
        const response = await axios.get(`${API_URL}/relatorios/vendas`, {
            withCredentials: true,
            params: {
                dataInicial,
                dataFinal,
            },
        });

        return response.data.relatorio_vendas;
    } catch (error: any) {
        console.log("Erro ao buscar relatório de vendas", error.response?.data || error.message);
        throw { mensagem: "Erro ao buscar relatório de vendas" };
    }
};

// Relatório de vendas do fornecedor
export const getRelatorioVendasFornecedor = async (dataInicial?: string, dataFinal?: string): Promise<any> => {
    try {
        const response = await axios.get(`${API_URL}/relatorios/vendas/fornecedor`, {
            withCredentials: true,
            params: {
                dataInicial,
                dataFinal,
            },
        });

        return response.data.relatorio_vendas_fornecedor;
    } catch (error: any) {
        console.log("Erro ao buscar relatório de vendas do fornecedor", error.response?.data || error.message);
        throw { mensagem: "Erro ao buscar relatório de vendas do fornecedor" };
    }
};

// Relatório de compras do comprador
export const getRelatorioComprasComprador = async (dataInicial?: string, dataFinal?: string): Promise<any> => {
    try {
        const response = await axios.get(`${API_URL}/relatorios/compras/comprador`, {
            withCredentials: true,
            params: {
                dataInicial,
                dataFinal,
            },
        });

        return response.data.relatorio_compras_comprador;
    } catch (error: any) {
        console.log("Erro ao buscar relatório de compras do comprador", error.response?.data || error.message);
        throw { mensagem: "Erro ao buscar relatório de compras do comprador" };
    }
};

// ===== EXPORTAÇÕES PDF =====

// Exportar PDF de compras do comprador (mantendo nome original)
export const exportarPDF = async (): Promise<Blob> => {
    try {
        const response = await axios.get(`${API_URL}/relatorios/exportar/compras/comprador/pdf`, {
            withCredentials: true,
            responseType: "blob",
        });

        return response.data;
    } catch (error: any) {
        console.log("Erro ao exportar PDF", error.response?.data || error.message);
        throw { mensagem: "Erro ao exportar PDF" };
    }
};

// Exportar PDF de vendas (admin) (mantendo nome original)
export const exportarPDFVendas = async (): Promise<Blob> => {
    try {
        const response = await axios.get(`${API_URL}/relatorios/exportar/vendas/pdf`, {
            withCredentials: true,
            responseType: "blob",
        });

        return response.data;
    } catch (error: any) {
        console.log("Erro ao exportar PDF de vendas", error.response?.data || error.message);
        throw { mensagem: "Erro ao exportar PDF de vendas" };
    }
};

// Exportar PDF de vendas do fornecedor
export const exportarPDFVendasFornecedor = async (): Promise<Blob> => {
    try {
        const response = await axios.get(`${API_URL}/relatorios/exportar/vendas/fornecedor/pdf`, {
            withCredentials: true,
            responseType: "blob",
        });

        return response.data;
    } catch (error: any) {
        console.log("Erro ao exportar PDF de vendas do fornecedor", error.response?.data || error.message);
        throw { mensagem: "Erro ao exportar PDF de vendas do fornecedor" };
    }
};

// ===== EXPORTAÇÕES CSV =====

// Exportar CSV de compras do comprador (mantendo nome original)
export const exportarCSV = async (): Promise<Blob> => {
    try {
        const response = await axios.get(`${API_URL}/relatorios/exportar/compras/comprador/csv`, {
            withCredentials: true,
            responseType: "blob",
        });

        return response.data;
    } catch (error: any) {
        console.log("Erro ao exportar CSV", error.response?.data || error.message);
        throw { mensagem: "Erro ao exportar CSV" };
    }
};

// Exportar CSV de vendas (admin) (mantendo nome original)
export const exportarCSVVendas = async (): Promise<Blob> => {
    try {
        const response = await axios.get(`${API_URL}/relatorios/exportar/vendas/csv`, {
            withCredentials: true,
            responseType: "blob",
        });

        return response.data;
    } catch (error: any) {
        console.log("Erro ao exportar CSV de vendas", error.response?.data || error.message);
        throw { mensagem: "Erro ao exportar CSV de vendas" };
    }
};

// Exportar CSV de vendas do fornecedor
export const exportarCSVVendasFornecedor = async (): Promise<Blob> => {
    try {
        const response = await axios.get(`${API_URL}/relatorios/exportar/vendas/fornecedor/csv`, {
            withCredentials: true,
            responseType: "blob",
        });

        return response.data;
    } catch (error: any) {
        console.log("Erro ao exportar CSV de vendas do fornecedor", error.response?.data || error.message);
        throw { mensagem: "Erro ao exportar CSV de vendas do fornecedor" };
    }
};

// ===== OUTRAS FUNÇÕES =====

// Atualizar status do pedido
export const actualizarStatusdoPedido = async (pedidoId: string, status: string): Promise<any> => {
    try {
        const response = await axios.put(`${API_URL}/relatorios/pedidos/${pedidoId}/status`, { status }, {
            withCredentials: true,
        });

        return response.data;
    } catch (error: any) {
        console.log("Erro ao atualizar status do pedido", error.response?.data || error.message);
        throw { mensagem: "Erro ao atualizar status do pedido" };
    }
};
