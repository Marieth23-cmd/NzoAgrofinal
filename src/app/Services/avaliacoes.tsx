import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://backend-nzoagro.onrender.com"

export const enviarAvaliacao = async (
  id_produtos: number,
  nota: number
): Promise<any> => {
  
  if (!id_produtos || isNaN(id_produtos)) {
    console.log("ID do produto inválido:", id_produtos);
    throw { mensagem: "ID do produto inválido" };
  }

  if (!nota || isNaN(nota) || nota < 1 || nota > 5) {
    console.log("Nota inválida:", nota);
    throw { mensagem: "A nota deve ser um número entre 1 e 5" };
  }

  try {
    console.log("Enviando avaliação:", { id_produtos, nota });
    
    const response = await axios.post(
      `${API_URL}/avaliacoes`, 
      { 
        id_produtos: Number(id_produtos), 
        nota: Number(nota)               
      },
      {
        withCredentials: true, 
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    
    console.log("Resposta da avaliação:", response.data);
    return response.data;
  } catch (error: any) {
    // Tratamento de erro melhorado
    console.log("Erro ao enviar avaliação:", error);
    
    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Dados:", error.response.data);
      
      // Retornar a mensagem de erro do servidor se disponível
      throw { 
        mensagem: error.response.data?.erro || "Erro ao enviar avaliação",
        status: error.response.status,
        detalhes: error.response.data
      };
    }
    
    throw { 
      mensagem: "Erro ao conectar com o servidor", 
      detalhes: error.message 
    };
  }
};


// Buscar todas as avaliações de um produto
export const buscarAvaliacoes = async (id_produtos: number): Promise<any> => {
  try {
    const response = await axios.get(`${API_URL}/avaliacoes/${id_produtos}`);
    return response.data;
  } catch (error: any) {
    console.log("Erro ao buscar avaliações", error);
    throw { mensagem: "Erro ao buscar avaliações" };
  }
};

export const buscarMediaEstrelas = async (id_produtos: number): Promise<any> => {
  try {
    const response = await axios.get(`${API_URL}/avaliacoes/media/${id_produtos}`);
    return response.data;
  } catch (error: any) {
    console.log("Erro ao buscar média de avaliações", error);
    throw { mensagem: "Erro ao buscar média de avaliações" };
  }
};
