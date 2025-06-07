import axios from "axios"

 const API_URL=process.env.NEXT_PUBLIC_API_URL || "https://backend-nzoagro.onrender.com"

 export const getProdutos= async(): Promise<any> =>{

    try{ 
        const response=await axios.get( `${API_URL}/produtos`)
        return response.data

    } catch(error:any){ 
        console.log( error.message)
        throw{mensagem:"Erro ao buscar produtos"}

    }

 } 

  export const getProdutoById =async(id:number):Promise<any> =>{
    try{
        const response= await axios.get(`${API_URL}/produtos/produto/${id} `)
        return response.data
    } 
    
    catch(error:any){
        console.log( error.response)
        throw{mensagem:"Erro ao buscar produto"}

    }

  }


  // Interface para o tipo de produto
export interface Produto {
    id_usuario?: number;
    nome: string;
    descricao?: string;
    preco: number;
    quantidade: number;
    foto_produto?: string;
    categoria: string;
    Unidade: string;
    provincia: string;
    peso_kg: number;
  }
  
  
  
  
  export const criarProduto = async (produtoData: FormData): Promise<any> => {
    try {
    
      const response = await axios.post(
        `${API_URL}/produtos/produtos`,
        produtoData,
        {withCredentials: true}
      );
  
      return response.data;
    } catch (error: any) {
      console.log("Erro ao criar produto:", error.response?.data || error.message);
      throw {
        mensagem: error.response?.data?.error || "Erro ao criar o produto",
        detalhes: error.response?.data?.detalhe || error.message
      };
    }
  };
      
  

export const atualizarProduto = async (id: number, produtoData: any): Promise<any> => {
    try {
        const response = await axios.put(`${API_URL}/produtos/atualizar/${id}`, produtoData, {
            headers: { "Content-Type": "application/json" },
            
            withCredentials: true});
        return response.data;
    } catch (error: any) {
        console.log("Erro ao atualizar produto:", error.response?.data || error.message);
        throw { mensagem: "Erro ao atualizar o produto" };
    }
};


export const deletarProduto = async (id: number): Promise<any> => {
    try {
        const response = await axios.delete(`${API_URL}/produtos/${id}`,
            { withCredentials: true } // Adicionando withCredentials aqui
        );
        return response.data;
    } catch (error: any) {
        console.log( error.message);
        throw { mensagem: "Erro ao deletar o produto" };
    }
};


export const buscarProdutosPorCategoria = async (
    categoria: string,
    filtros: { provincia?: string; precoMin?: number; precoMax?: number }
  ): Promise<any[]> => {
    try {
      const queryParams = new URLSearchParams();
  
      if (filtros.provincia) queryParams.append("provincia", filtros.provincia);
      if (filtros.precoMin !== undefined) queryParams.append("precoMin", filtros.precoMin.toString());
      if (filtros.precoMax !== undefined) queryParams.append("precoMax", filtros.precoMax.toString());
  
      const response = await axios.get(`${API_URL}/produtos/categoria/${categoria}?${queryParams.toString()}`);
      return response.data;
    } catch (error: any) {
      console.log ("Erro ao buscar produtos por categoria:", error.response?.data || error.message);
      throw { mensagem: "Erro ao buscar produtos da categoria" };
    }
  };

// Função para buscar produtos por usuário
// Essa função faz uma requisição GET para a API, passando o ID do usuário como parâmetro na URL
// e retorna a lista de produtos associados a esse usuário.
// O ID do usuário é passado como argumento para a função
// O retorno da função é uma Promise que resolve para um array de produtos
// O tratamento de erros é feito com um bloco try-catch, onde se houver um erro na requisição,
// ele é capturado e uma mensagem de erro é exibida no console
 export const getProdutosPorUsuario = async (): Promise<any[]> => {
  try {
    const response = await axios.get(`${API_URL}/produtos/produtos/meus-produtos`, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    console.log("Erro ao buscar produtos do usuário:", error.response?.data || error.message);
    throw { mensagem: "Erro ao buscar produtos do usuário" };
  }
};


export const getProdutosDestaque = async () => {
  try {
    const response = await axios.get(`${API_URL}/produtos/destaque`);
    return response.data;
  } catch (error:any) {
    console.log("Erro ao buscar produtos em destaque:", error.response?.data || error.message);
    throw { mensagem: "Erro ao buscar produtos em destaque" };
  }
};




// Função para destacar um produto com um pacote específico
export const destacarProduto = async (idProduto: number, pacote: number) => {
  try {
    const response = await axios.post(
      `${API_URL}/produtos/${idProduto}/destaque`,
      { pacote }, // Envia o tipo de pacote (3, 5, 7 ou 30 dias)
      { withCredentials: true }
    );
    return response.data;
  } catch (error:any) {
    console.log("Erro ao destacar produto:", error.response?.data || error.message);
    throw { mensagem: error.response?.data?.error || "Erro ao destacar produto" };
  }
};

// Função para verificar o status de destaque de um produto
export const verificarStatusDestaque = async (idProduto:number) => {
  try {
    const response = await axios.get(`${API_URL}/produtos/${idProduto}/status-destaque`, {
      withCredentials: true
    });
    return response.data;
  } catch (error:any) {
    console.log("Erro ao verificar status de destaque:", error.response?.data || error.message);
    throw { mensagem: "Erro ao verificar status de destaque" };
  }
};

// Função pa

export const buscarDadosPagamento = async (idPagamento: number) => {
  try {
    const response = await axios.get(
      `${API_URL}/pagamentos/${idPagamento}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    console.log("Erro ao buscar dados do pagamento:", error.response?.data || error.message);
    throw { mensagem: error.response?.data?.error || "Erro ao buscar dados do pagamento" };
  }
};

// Função para processar o pagamento de destaque
export const processarPagamentoDestaque = async (idPagamento: number, metodoPagamento: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/pagamentos/${idPagamento}/confirmar`,
      { metodoPagamento },
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    console.log("Erro ao processar pagamento:", error.response?.data || error.message);
    throw { mensagem: error.response?.data?.error || "Erro ao processar pagamento" };
  }
};

// Função para obter pacotes de destaque disponíveis
export const obterPacotesDestaque = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/produtos/produtos/pacotes-destaque`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    console.log("Erro ao obter pacotes de destaque:", error.response?.data || error.message);
    throw { mensagem: error.response?.data?.error || "Erro ao obter pacotes de destaque" };
  }
};
