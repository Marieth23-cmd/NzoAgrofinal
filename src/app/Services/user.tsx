import axios from "axios";
import cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const getUsuarios = async (): Promise<any> => {
    try {
        const response = await axios.get(`${API_URL}/usuarios`);
        return response.data;
    } catch (error: any) {
        console.log("Erro ao buscar usuários", error.response?.data || error.message);
        throw { mensagem: "Erro ao buscar usuários" };
    }
};
export const getUsuarioById = async (): Promise<any> => {
    try {
        const response = await axios.get(`${API_URL}/usuarios/me`, {
            withCredentials: true,
        });

        return response.data.usuario; 
    } catch (error: any) {
        console.log("Erro ao buscar usuário", error.response?.data || error.message);
        throw { mensagem: "Erro ao buscar usuário" };
    }
};


export const criarUsuario = async (usuarioData: any): Promise<any> => {
    try {
        // Adicionar dados que possam estar faltando
        const dadosCompletos = {
            ...usuarioData,
            data_criacao: new Date().toISOString(),
            pais: usuarioData.pais || "Angola" // Valor padrão se não fornecido
        };

        if (dadosCompletos.contacto && dadosCompletos.contacto.includes('244|')) {
            dadosCompletos.contacto = dadosCompletos.contacto.replace('244|', '');
        }

        console.log("Enviando dados para API:", dadosCompletos);
        
        const response = await axios.post(`${API_URL}/usuarios`, dadosCompletos, {
            headers: { "Content-Type": "application/json" },
        });
        
        console.log("Resposta da API:", response.data);
        return response.data;
    } catch (error: any) {
        console.log("Erro completo:", error);
        
        
        if (error.response) {
            console.log("Dados da resposta de erro:", error.response.data);
            console.log("Status do erro:", error.response.status);
            console.log("Cabeçalhos:", error.response.headers);
            throw { 
                mensagem: error.response.data?.message || error.response.data?.mensagem || "Erro ao criar usuário",
                status: error.response.status,
                campo: error.response.data?.campo
            };
        } else if (error.request) {
            console.log("Sem resposta do servidor:", error.request);
            throw { mensagem: "Sem resposta do servidor. Verifique sua conexão." };
        } else {
            console.log("Erro na configuração da requisição:", error.message);
            throw { mensagem: "Erro ao configurar a requisição:" + error.message };
        }
    }
};
export const atualizarUsuario = async (usuarioData: any): Promise<any> => {
    try {
      const response = await axios.put(`${API_URL}/usuarios/perfil`, usuarioData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      console.log("Erro ao atualizar usuário", error.response?.data || error.message);
      throw { mensagem: "Erro ao atualizar usuário" };
    }
  };
  
export const deletarUsuario = async (id: number): Promise<any> => {
    try {
        const response = await axios.delete(`${API_URL}/usuarios/${id}`,{
            withCredentials: true, 
        });;
        return response.data;
    } catch (error: any) {
        console.log("Erro ao excluir usuário", error.response?.data || error.message);
        throw { mensagem: "Erro ao excluir usuário" };
    }
};
