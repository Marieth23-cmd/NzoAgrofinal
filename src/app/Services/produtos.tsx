import axios from "axios"
 const API_URL=process.env.NXT_PUBLIC_API_URL||"http://localhost:4000"

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
        const response= await axios.get(`${API_URL}/produto/${id} `)
        return response.data


    } 
    
    catch(error:any){
        console.log( error.response)
        throw{mensagem:"Erro ao buscar produto"}

    }

  }


  export const criarProduto = async (produtoData: any): Promise<any> => {
    try {
        const response = await axios.post(`${API_URL}/produtos`, produtoData, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true, 
        });

        return response.data;
    } catch (error: any) {
        console.log( error.message);
        throw { mensagem: "Erro ao criar o produto" };
    }
};



 
export const atualizarProduto = async (id: number, produtoData: any): Promise<any> => {
    try {
        const response = await axios.put(`${API_URL}/produtos/${id}`, produtoData, {
            headers: { "Content-Type": "application/json" },
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
  

