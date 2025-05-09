import axios from "axios"
import Cookies from 'js-cookie';
 const API_URL=process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

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
    id?: number;
    nome: string;
    descricao?: string;
    preco: number;
    quantidade: number;
    foto_produto?: string;
    categoria: string;
    Unidade: string;
    provincia: string;
  }
  
  
  
  
  export const criarProduto = async (produtoData: FormData): Promise<any> => {
    try {
      const token = Cookies.get("token"); 
  
      const response = await axios.post(
        `${API_URL}/produtos/produtos`,
        produtoData,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );
  
      return response.data;
    } catch (error: any) {
      console.log("Erro ao criar produto:", error.response?.data || error.message);
      throw {
        mensagem: error.response?.data?.erro || "Erro ao criar o produto",
        detalhes: error.response?.data?.detalhe || error.message
      };
    }
  };
      
  




 
export const atualizarProduto = async (id: number, produtoData: any): Promise<any> => {
    try {
        const response = await axios.put(`${API_URL}/produtos/atualizar/${id}`, produtoData, {
            headers: { "Content-Type": "application/json" },
            withCredentials:true
        });
        return response.data;
    } catch (error: any) {
        console.log("Erro ao atualizar produto:", error.response?.data || error.message);
        throw { mensagem: "Erro ao atualizar o produto" };
    }
};


export const deletarProduto = async (id: number): Promise<any> => {
    try {
        const response = await axios.delete(`${API_URL}/produtos/${id}`);
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
  

