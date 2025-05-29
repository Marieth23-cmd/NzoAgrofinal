import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Iniciar um pagamento móvel
export const iniciarPagamento = async (
  id_pedido: number,
  tipo_pagamento: string,
  telefone_pagador: string,
  id_comprador: number
): Promise<any> => {
  try {
    const response = await axios.post(
      `${API_URL}/pagamentos`,
      {
        id_pedido,
        tipo_pagamento,
        telefone_pagador,
        id_comprador,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Erro ao iniciar pagamento:", error.response?.data || error.message);

    throw error.response?.data || {
      mensagem: "Erro desconhecido ao iniciar o pagamento",
    };
  }
};

// Verificar o status de uma transação
export const verificarStatusPagamento = async (
  transacao_id: string
): Promise<any> => {
  try {
    const response = await axios.get(
      `${API_URL}/pagamentos/status/${transacao_id}`,
      { withCredentials: true }
    );

    return response.data;
  } catch (error: any) {
    console.error("Erro ao verificar status da transação:", error.response?.data || error.message);

    throw error.response?.data || {
      mensagem: "Erro desconhecido ao verificar status",
    };
  }
};
