import axios from "axios"
import { promises } from "dns"
 const API_URL=process.env.NXT_PUBLIC_API_URL||"http://localhost:4001"

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
        const response= await axios.get(`${API_URL}/produtos/${id} `)
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
            withCredentials: true, // Garante que o token do cookie seja enviado
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
        console.error("Erro ao atualizar produto:", error.response?.data || error.message);
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