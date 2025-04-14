import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Função para fazer login
export const login = async (email: string, senha: string): Promise<any> => {
    try {
        const response = await axios.post(
            `${API_URL}/login`,{ email, senha }, 
            {
                withCredentials: true, 
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data; 

    } catch (error: any) {
        console.log("Erro no login:", error.response?.data || error.message); 

        
        if (error.response && error.response.data) {
            throw error.response.data;
        } else {
            console.log("Erro no login:", error.message);
            throw { mensagem: "Erro desconhecido ao tentar entrar" };
        }
    }
};


export const logout = async (): Promise<any> => {
    try {
        const response = await axios.post(
            `${API_URL}/login/logout`,
            {},
            { withCredentials: true }
        );

        return response.data; 
    } catch (error: any) {
        console.log("Erro ao terminar sessão:", error.response?.data || error.message);

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

        console.log("Resposta da API de autenticação:", response.data);
        return response.data;

    } catch (error: any) {
        console.log("Erro ao verificar autenticação:");

        throw error.response?.data || { mensagem: "Erro desconhecido na verificação de autenticação" };
    }
};



