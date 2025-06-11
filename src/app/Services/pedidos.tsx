import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://backend-nzoagro.onrender.com"

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
// export const getPedidosUsuario = async (): Promise<any> => {
//   try {
//     const response = await axios.get(`${API_URL}/pedidos/especifico`, {
//       withCredentials: true
//     });
//     return response.data;
//   } catch (error: any) {
//     console.log(error.message);
//     throw { mensagem: "Erro ao buscar seus pedidos" };
//   }
// };



export const getPedidosUsuario = async (): Promise<any> => {
  try {
    // Get token from localStorage or sessionStorage
    const token = 
      localStorage.getItem('token') || 
      localStorage.getItem('authToken') || 
      sessionStorage.getItem('token') || 
      sessionStorage.getItem('authToken');

    if (!token) {
      throw new Error('Token de autenticação não encontrado');
    }

    // Make the request with the token in headers
    const response = await axios.get(`${API_URL}/pedidos/especifico`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });

    if (!response.data) {
      throw new Error('Nenhum dado retornado da API');
    }

    return response.data;

  } catch (error: any) {
    console.error('Erro ao buscar pedidos:', error);
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      throw { 
        mensagem: "Sessão expirada. Por favor, faça login novamente.",
        tipo: "auth" 
      };
    }
    
    if (error.message.includes('Token')) {
      throw { 
        mensagem: "Por favor, faça login para ver seus pedidos",
        tipo: "auth" 
      };
    }

    throw { 
      mensagem: "Erro ao buscar seus pedidos", 
      erro: error.response?.data?.message || error.message 
    };
  }
};



// Interface para tipagem dos dados de pagamento do pedido
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

export const iniciarNovoPedido = async (dadosPedido: {
  // Dados do endereço
  rua: string;
  bairro: string;
  pais: string;
  municipio: string;
  referencia: string;
  provincia: string;
  numero: string;
  
  // Dados do pedido
  itens: Array<{
    id_produto: number;
    quantidade_comprada: number;
    preco: number;
    subtotal: number;
  }>;
  
  // Valores calculados
  valor_total: number;
  estado: string; // Iniciado, Pendente, etc
}): Promise<PedidoPagamentoData> => {
  try {
    // Primeiro cria o pedido
    const pedidoCriado = await criarPedido(dadosPedido);
    
    // Depois busca os dados completos do pedido para pagamento
    const dadosPagamento = await buscarPedidoPagamento(pedidoCriado.id_pedido);
    
    return dadosPagamento;
  } catch (error: any) {
    console.error('Erro ao iniciar pedido:', error);
    throw { 
      mensagem: error.response?.data?.message || "Erro ao iniciar o pedido",
      detalhes: error.response?.data
    };
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