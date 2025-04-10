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
    const token=cookies.get("token")

    if(!token){
        console.log("token não encontrado")
        throw new Error("Token não encontrado");

    }
    try {
        const response = await axios.get(`${API_URL}/usuarios/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        console.log("Erro ao buscar usuário", error.response?.data || error.message);
        throw { mensagem: "Erro ao buscar usuário" };
    }
};

export const criarUsuario = async (usuarioData: any): Promise<any> => {
    try {
        console.log("Enviando dados para API:", usuarioData);
        const response = await axios.post(`${API_URL}/usuarios`, usuarioData, {
            headers: { "Content-Type": "application/json" },
        });
        console.log("Resposta da API:", response.data);
        return response.data;
    } catch (error:any) {   
        console.log( error.message);
     throw { mensagem: error.response?.data?.mensagem || "Erro ao criar usuário" };
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
        const response = await axios.delete(`${API_URL}/usuarios/${id}`);
        return response.data;
    } catch (error: any) {
        console.log("Erro ao excluir usuário", error.response?.data || error.message);
        throw { mensagem: "Erro ao excluir usuário" };
    }
};
