import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const getUsuarios = async (): Promise<any> => {
    try {
        const response = await axios.get(`${API_URL}/usuarios`);
        return response.data;
    } catch (error: any) {
        console.error("Erro ao buscar usuários", error.response?.data || error.message);
        throw { mensagem: "Erro ao buscar usuários" };
    }
};

export const getUsuarioById = async (id: number): Promise<any> => {
    try {
        const response = await axios.get(`${API_URL}/usuarios/${id}`);
        return response.data;
    } catch (error: any) {
        console.error("Erro ao buscar usuário", error.response?.data || error.message);
        throw { mensagem: "Erro ao buscar usuário" };
    }
};

export const criarUsuario = async (usuarioData: any): Promise<any> => {
    try {
        const response = await axios.post(`${API_URL}/usuarios`, usuarioData, {
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error: any) {
        console.error("Erro ao criar usuário", error.response?.data || error.message);
        throw { mensagem: "Erro ao criar usuário" };
    }
};

export const atualizarUsuario = async (id: number, usuarioData: any): Promise<any> => {
    try {
        const response = await axios.put(`${API_URL}/usuarios/${id}`, usuarioData, {
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error: any) {
        console.error("Erro ao atualizar usuário", error.response?.data || error.message);
        throw { mensagem: "Erro ao atualizar usuário" };
    }
};

export const deletarUsuario = async (id: number): Promise<any> => {
    try {
        const response = await axios.delete(`${API_URL}/usuarios/${id}`);
        return response.data;
    } catch (error: any) {
        console.error("Erro ao excluir usuário", error.response?.data || error.message);
        throw { mensagem: "Erro ao excluir usuário" };
    }
};
