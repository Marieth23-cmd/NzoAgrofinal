import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Obter todos os pedidos (apenas para administradores)
export const getPedidos = async (): Promise<any> => {
  try {
    const response = await axios.get(`${API_URL}/pedidos`, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    console.log(error.message);
    throw { mensagem: "Erro ao buscar pedidos" };
  }
};

// Obter pedidos específicos do usuário autenticado
export const getPedidosUsuario = async (): Promise<any> => {
  try {
    const response = await axios.get(`${API_URL}/pedidos/especifico`, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    console.log(error.message);
    throw { mensagem: "Erro ao buscar seus pedidos" };
  }
};

// Criar um novo pedido
export const criarPedido = async (pedidoData: {
  estado: string;
  valor_total: number;
  rua: string;
  bairro: string;
  pais: string;
  municipio: string;
  referencia: string;
  provincia: string;
  numero: string;
  itens: Array<{
    quantidade_comprada: number;
    preco: number;
    subtotal: number;
    id_produto: number;
  }>;
}): Promise<any> => {
  try {
    const response = await axios.post(`${API_URL}/pedidos/criar`, pedidoData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    console.log(error.response?.data || error.message);
    throw { mensagem: error.response?.data?.message || "Erro ao criar o pedido" };
  }
};

// Excluir um pedido
export const deletarPedido = async (id_pedido: number): Promise<any> => {
  try {
    const response = await axios.delete(`${API_URL}/pedidos/${id_pedido}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    console.log(error.response?.data || error.message);
    throw { mensagem: "Erro ao excluir o pedido" };
  }
};

// Interface para tipagem dos pedidos
export interface Pedido {
  id_pedido: number;
  estado: string;
  valor_total: number;
  data_pedido: string;
  nome_usuario?: string;
  itens?: Array<{
    id_produto: number;
    quantidade_comprada: number;
    preco: number;
    subtotal: number;
  }>;
}

// Interface para tipagem dos dados de criação do pedido
export interface PedidoData {
  estado: string;
  valor_total: number;
  rua: string;
  bairro: string;
  pais: string;
  municipio: string;
  referencia: string;
  provincia: string;
  numero: string;
  itens: Array<{
    quantidade_comprada: number;
    preco: number;
    subtotal: number;
    id_produto: number;
  }>;
}


export interface PedidoPagamentoData {
  id_pedido: number;
  valor_total: number;
  estado: string;
  data_pedido: string;
  rua?: string;
  bairro?: string;
  pais?: string;
  municipio?: string;
  referencia?: string;
  provincia?: string;
  numero?: string;
  itens: Array<{
    id_produto: number;
    quantidade_comprada: number;
    preco: number;
    subtotal: number;
    nome_produto: string;
    peso_kg: number;
  }>;
  resumo: {
    subtotal: number;
    frete: number;
    comissao: number;
    total: number;
    peso_total: number;
    quantidade_itens: number;
  };
}




export const buscarPedidoPagamento = async (id_pedido: number): Promise<PedidoPagamentoData> => {
  try {
    const response = await axios.get(`${API_URL}/pedidos/pagamento/${id_pedido}`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    console.log(error.response?.data || error.message);
    throw { mensagem: error.response?.data?.message || "Erro ao buscar dados do pedido" };
  }
};

// Confirmar pagamento do pedido
export const confirmarPagamento = async (dadosPagamento: {
  id_pedido: number;
  metodo_pagamento: string;
  referencia_pagamento: string;
  valor_pago: number;
}): Promise<any> => {
  try {
    const response = await axios.post(`${API_URL}/pedidos/confirmar-pagamento`, dadosPagamento, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    console.log(error.response?.data || error.message);
    throw { mensagem: error.response?.data?.message || "Erro ao confirmar pagamento" };
  }
};