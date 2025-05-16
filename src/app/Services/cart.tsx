import axios, { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

export const adicionarProdutoAoCarrinho = async (
    id_produto: number | string,
    quantidade: number = 1
) => {
    try {
        const response = await axios.post(
            `${API_URL}/carrinho/adicionar`,
            {  id_produto, quantidade },
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
    id_produtos: string,
    quantidade: number
) => {
    try {
        const response = await axios.put(
            `${API_URL}/carrinho/atualizar/${id_produtos}`,
            { quantidade },
            {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            }
        );

        const {
          precoUnitario,
          precoCliente,
          pesoTotal,
          frete,
          comissao,
          totalFinal
        } = response.data;
    
        
        console.log("Preço unitario:", precoUnitario)
        console.log("Preço do produto:", precoCliente);
        console.log("Peso total:", pesoTotal);
        console.log("Frete:", frete);
        console.log("Comissão:", comissao);
        console.log("Total Final:", totalFinal);
    
        return response.data;
    } catch (error:any) {
        const axiosError = error as AxiosError;
        console.log("Erro ao atualizar a quantidade do produto:", axiosError.response?.data || axiosError.message);
        throw axiosError.response?.data || { mensagem: "Erro desconhecido ao atualizar a quantidade do produto" };
    }
};
// Função para calcular o preço do produto (service)
export const calcularPrecoProduto = async (
  produtoId: string,
  quantidadeCliente: number,
  pesoTotal?: number // Parâmetro opcional para o peso total
) => {
  try {
    const response = await axios.post(
      `${API_URL}/carrinho/calcular-preco`,
      { produtoId, quantidadeCliente, pesoTotal }, // Incluímos o pesoTotal na requisição
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error: any) {
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