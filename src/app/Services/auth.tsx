import axios from "axios";

// Definição da URL base da API
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Função para fazer login
export const login = async (email: string, senha: string): Promise<any> => {
    try {
        const response = await axios.post(
            `${API_URL}/login`,{ email, senha }, 
            {
                withCredentials: true, // Permitir cookies para autenticação
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data; // Retorna exatamente a resposta da API

    } catch (error: any) {
        console.error("Erro no login:", error.response?.data || error.message); 

        // Se a API retornar erro, exibe exatamente a mensagem da API
        if (error.response && error.response.data) {
            throw error.response.data;
        } else {
            throw { mensagem: "Erro desconhecido ao tentar entrar" };
        }
    }
};

// Função para logout
export const logout = async (): Promise<any> => {
    try {
        const response = await axios.post(
            `${API_URL}/login/logout`,
            {},
            { withCredentials: true }
        );

        return response.data; // Retorna exatamente a resposta da API

    } catch (error: any) {
        console.error("Erro ao terminar sessão:", error.response?.data || error.message);

        if (error.response && error.response.data) {
            throw error.response.data;
        } else {
            throw { mensagem: "Erro desconhecido ao terminar sessão" };
        }
    }
};

// Função para verificar autenticação
export const verificarAuth = async (): Promise<any> => {
    try {
        const response = await axios.get(`${API_URL}/login/auth/verificar`, {
            withCredentials: true,
        });

        return response.data; // Retorna exatamente a resposta da API

    } catch (error: any) {
        console.error("Erro ao verificar autenticação:", error.response?.data || error.message);

        if (error.response && error.response.data) {
            throw error.response.data;
        } else {
            throw { mensagem: "Erro desconhecido na verificação de autenticação" };
        }
    }
};


