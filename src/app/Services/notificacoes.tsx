// services/notificacoes.ts
import axios, { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

export const listarNotificacoes = async () => {
  try {
    const response = await axios.get(`${API_URL}/notificacoes`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    const axiosError = error as AxiosError;
    console.log("Erro ao listar notificações:", axiosError.response?.data || axiosError.message);
    throw axiosError.response?.data || { mensagem: "Erro desconhecido ao listar notificações" };
  }
};

export const deletarNotificacao = async (id_notificacoes:number) => {
  try {
    const response = await axios.delete(`${API_URL}/notificacoes/${id_notificacoes}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    const axiosError = error as AxiosError;
    console.log("Erro ao deletar notificação:", axiosError.response?.data || axiosError.message);
    throw axiosError.response?.data || { mensagem: "Erro desconhecido ao deletar notificação" };
  }
};

export const deletarTodasNotificacoes = async () => {
  try {
    const response = await axios.delete(`${API_URL}/notificacoes/usuario`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    const axiosError = error as AxiosError;
    console.log("Erro ao deletar todas as notificações:", axiosError.response?.data || axiosError.message);
    throw axiosError.response?.data || { mensagem: "Erro desconhecido ao deletar todas as notificações" };
  }
};

export const marcarNotificacaoComoLida = async (id_notificacoes:number) => {
  try {
    const response = await axios.patch(
      `${API_URL}/notificacoes/${id_notificacoes}`,
      {},
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error: any) {
    const axiosError = error as AxiosError;
    console.log("Erro ao marcar notificação como lida:", axiosError.response?.data || axiosError.message);
    throw axiosError.response?.data || { mensagem: "Erro desconhecido ao marcar como lida" };
  }
};


export const badgeNotificacoes = async () => {
  try {
    const response = await axios.get(`${API_URL}/notificacoes/nao-lidas/quantidade`, { withCredentials: true });
    return response.data;
  } catch (error: any) {
    const axiosError = error as AxiosError;
    console.log("Erro ao obter a quantidade de notificações não lidas:", axiosError.response?.data || axiosError.message);
    throw axiosError.response?.data || { mensagem: "Erro desconhecido ao obter quantidade de notificações não lidas" };
  }
};