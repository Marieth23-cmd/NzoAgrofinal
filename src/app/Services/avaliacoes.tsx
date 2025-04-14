import axios from "axios";

const API_URL = process.env.NXT_PUBLIC_API_URL || "http://localhost:4000";

// Enviar avaliação (nova ou atualizar)
export const enviarAvaliacao = async (
  id_produtos: number,
  nota: number,
  token: string
): Promise<any> => {
  try {
    const response = await axios.post(
      `${API_URL}/avaliacoes`,
      { id_produtos, nota },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.log("Erro ao enviar avaliação", error);
    throw { mensagem: "Erro ao enviar avaliação" };
  }
};

// Buscar todas as avaliações de um produto
export const buscarAvaliacoes = async (id_produtos: number): Promise<any> => {
  try {
    const response = await axios.get(`${API_URL}/avaliacoes/${id_produtos}`);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar avaliações", error);
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
