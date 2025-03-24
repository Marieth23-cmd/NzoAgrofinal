import axios, { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const adicionarProdutoAoCarrinho = async (
    id_usuario: string,
    id_produto: string,
    quantidade: number = 1
) => {
    try {
        const response = await axios.post(
            `${API_URL}/carrinho/adicionar`,
            { id_usuario, id_produto, quantidade },
            {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            }
        );
        return response.data;
    } catch (error: unknown) {
        const axiosError = error as AxiosError;
        console.error("Erro ao adicionar produto ao carrinho:", axiosError.response?.data || axiosError.message);
        throw axiosError.response?.data || { mensagem: "Erro desconhecido ao adicionar produto ao carrinho" };
    }
};

export const listarProdutosDoCarrinho = async (id_usuario: string) => {
    try {
        const response = await axios.get(`${API_URL}/carrinho/${id_usuario}`, { withCredentials: true });
        return response.data;
    } catch (error: unknown) {
        const axiosError = error as AxiosError;
        console.error("Erro ao listar produtos do carrinho:", axiosError.response?.data || axiosError.message);
        throw axiosError.response?.data || { mensagem: "Erro desconhecido ao listar produtos do carrinho" };
    }
};

export const removerProdutoDoCarrinho = async (id_usuario: string, id_produto: string) => {
    try {
        const response = await axios.delete(`${API_URL}/carrinho/remover/${id_usuario}/${id_produto}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error: unknown) {
        const axiosError = error as AxiosError;
        console.error("Erro ao remover produto do carrinho:", axiosError.response?.data || axiosError.message);
        throw axiosError.response?.data || { mensagem: "Erro desconhecido ao remover produto do carrinho" };
    }
};

export const esvaziarCarrinho = async (id_usuario: string) => {
    try {
        const response = await axios.delete(`${API_URL}/carrinho/esvaziar/${id_usuario}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error: unknown) {
        const axiosError = error as AxiosError;
        console.error("Erro ao esvaziar o carrinho:", axiosError.response?.data || axiosError.message);
        throw axiosError.response?.data || { mensagem: "Erro desconhecido ao esvaziar o carrinho" };
    }
};

export const atualizarQuantidadeProduto = async (
    id_usuario: string,
    id_produto: string,
    quantidade: number
) => {
    try {
        const response = await axios.put(
            `${API_URL}/carrinho/atualizar/${id_usuario}/${id_produto}`,
            { quantidade },
            {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            }
        );
        return response.data;
    } catch (error: unknown) {
        const axiosError = error as AxiosError;
        console.error("Erro ao atualizar a quantidade do produto:", axiosError.response?.data || axiosError.message);
        throw axiosError.response?.data || { mensagem: "Erro desconhecido ao atualizar a quantidade do produto" };
    }
};
