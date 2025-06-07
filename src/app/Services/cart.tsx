import axios, { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://backend-nzoagro.onrender.com"

export const adicionarProdutoAoCarrinho = async (
    id_produto: number | string,
    quantidade: number ,
    unidade?: string,
    peso? :number,
    preco?: number
) => {
    try {
        const response = await axios.post(
            `${API_URL}/carrinho/adicionar`,
            {  id_produto, quantidade ,unidade , peso, preco},
            {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            }
        );
        return response.data;
    } catch (error:any) {
        const axiosError = error as AxiosError;
        console.log("Erro ao adicionar produto ao carrinho:", axiosError.response?.data || axiosError.message);
        throw axiosError.response?.data || { mensagem: "Erro desconhecido ao adicionar produto ao carrinho" };
    }
};

export const listarProdutosDoCarrinho = async () => {
    try {
        const response = await axios.get(`${API_URL}/carrinho`, { withCredentials: true });
        return response.data;
    } catch (error:any) {
        const axiosError = error as AxiosError;
        console.log("Erro ao listar produtos do carrinho:", axiosError.response?.data || axiosError.message);
        throw axiosError.response?.data || { mensagem: "Erro desconhecido ao listar produtos do carrinho" };
    }
};

export const removerProdutoDoCarrinho = async ( id_produtos: string) => {
    try {
        const response = await axios.delete(`${API_URL}/carrinho/remover/${id_produtos}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error: any) {
        const axiosError = error as AxiosError;
        console.log("Erro ao remover produto do carrinho:", axiosError.response?.data || axiosError.message);
        throw axiosError.response?.data || { mensagem: "Erro desconhecido ao remover produto do carrinho" };
    }
};

export const esvaziarCarrinho = async () => {
    try {
        const response = await axios.delete(`${API_URL}/carrinho/esvaziar`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error: any) {
        const axiosError = error as AxiosError;
        console.log("Erro ao esvaziar o carrinho:", axiosError.response?.data || axiosError.message);
        throw axiosError.response?.data || { mensagem: "Erro desconhecido ao esvaziar o carrinho" };
    }
};

export const atualizarQuantidadeProduto = async (
    id_produto: string,
    quantidade: number
) => {
    try {
        const response = await axios.put(
            `${API_URL}/carrinho/atualizar/${id_produto}`,
            { quantidade },
            {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            }
        );
        return response.data;
    } catch (error:any) {
        const axiosError = error as AxiosError;
        console.log("Erro ao atualizar quantidade do produto:", axiosError.response?.data || axiosError.message);
        throw axiosError.response?.data || { mensagem: "Erro desconhecido ao atualizar quantidade do produto" };
    }
};


export const calcularPrecoProduto = async (
  produtoId: string,
  quantidadeCliente: number,
  pesoTotal?: number 
) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos de timeout
    
    const response = await axios.post(
      `${API_URL}/carrinho/calcular-preco`,
      { produtoId, quantidadeCliente, pesoTotal }, // Incluímos o pesoTotal na requisição
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
        signal: controller.signal
      }
    );
    
    clearTimeout(timeoutId);
    return response.data;
  } catch (error: any) {
    if (error.name === 'AbortError' || error.name === 'CanceledError') {
      throw new Error('A requisição foi cancelada por timeout');
    }
    
    const axiosError = error as AxiosError;
    console.log(
      "Erro ao calcular o preço do produto:",
      axiosError.response?.data || axiosError.message
    );
    throw axiosError.response?.data || {
      mensagem: "Erro desconhecido ao calcular o preço do produto",
    };
  }
};





export const finalizarCompra = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/carrinho/finalizar-compra`,
      {},
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error: any) {
    const axiosError = error as AxiosError;
    console.log(
      "Erro ao finalizar a compra:",
      axiosError.response?.data || axiosError.message
    );
    
    // Verifica se é um erro com resposta da API
    if (axiosError.response && axiosError.response.data) {
      throw axiosError.response.data;
    }
    
    // Caso contrário, lança um erro genérico
    throw {
      mensagem: "Erro desconhecido ao finalizar a compra",
    };
  }
};


export const iniciarCheckout = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/carrinho/iniciar-checkout`,
      {},
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error:any) {
    console.log(
      "Erro ao iniciar checkout:",
      error.response?.data || error.message
    );
    
    // Verifica se é um erro com resposta da API
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    
    // Caso contrário, lança um erro genérico
    throw {
      mensagem: "Erro desconhecido ao iniciar o checkout",
    };
  }
};
