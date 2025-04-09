 import Head from "next/head"
 import Footer from "../Components/Footer"
import Navbar from "../Components/Navbar"



 export default function EditarProduto(){
    return(
        <main>
            <Head>
                <title>Editar Produto</title>
            </Head>
            <Navbar/>
            <div>
            <div className="bg-white rounded-[10px] p-8 w-full max-w-[800px] ml-[20%] mb-20 mt-[15%] shadow-custom">
               
             <h3 className="mb-6 text-marieth text-[1.8rem] font-bold ">Editar Produto</h3>

            <div className="mb-4 items-center">
             <label htmlFor="Provincia"  className="sr-only" >Provincia</label>
                <select name="Provincia" id="Provincia" required className=" w-full p-[0.8rem] border-[1px] border-solid border-tab rounded-[10px]
                text-base transition-colors duration-150 cursor-pointer font-medium text-profile  "> 
                    <option value=" Província">Província</option>
                    
                </select>
             
             </div>

                    <div className="mb-4  " >
                    <label htmlFor="option" className="sr-only">Categoria</label>
                <select name="option" id="option" required className="mb-6 cursor-pointer font-medium text-profile  
                w-full p-[0.8rem] border-[1px] border-solid border-tab rounded-[10px] text-base transition-colors duration-150 " >
                    <option value="">Escolha uma Categoria</option>
                    <option value="Frutas">Frutas</option>
                    <option value="Verduras"> Verduras</option>
                    <option value="Insumos Agricolas">Insumos Agricolas</option>
                    <option value="Grãos">Grãos</option>
                    <option value="Tubérculos e Raízes">Tubérculos e Raízes</option>
                 </select>
                 
                 </div>
        

                <div className="mb-4" >
                    <label htmlFor="produto" className="sr-only">Nome Produto</label>
                    <select name="Produtos" id="produto" required className=" w-full p-[0.8rem] border-[1px] border-solid border-tab rounded-[10px]
                text-base transition-colors duration-150 cursor-pointer font-medium text-profile  ">
                    <option value="">Escolha o nome do seu Produto</option>
                    <option value=""></option>
                    <option value=""></option>
                     </select>
                     </div>

                     <div className="mb-4 flex gap-2" > 
                        <label htmlFor="quantidade" className=" font-medium mt-3 ">Quantidade:</label>
                        <input type="number" id="quantidade" min="1" name="quantidade" className=" required:ml-[4px] w-full p-[0.8rem] cursor-pointer border-[1px] border-solid border-tab rounded-[10px]
                text-base transition-colors duration-150" />
                
                    <label htmlFor="produtos" className="sr-only">Unidade</label>
                    <select name="Produtos" id="produtos" required className="  w-full p-[0.8rem] border-[1px] border-solid border-tab rounded-[10px]
                text-base transition-colors duration-150 cursor-pointer font-medium text-profile  ">
                    <option value="Unidade">Unidade</option>
                    <option value="Tonelada">Tonelada(1000Kg)</option>
                    <option value="Quintal(100Kg)">Quintal(100Kg)</option>
                    
                     </select>
                     </div>
                


                <div className="mb-4" >
                <label htmlFor="preco" className="block  font-medium text-profile  mb-2">Preço(AOA)</label>
                <input type="number" id="preco"required min={1} className="  required:ml-[4px] w-full p-[0.8rem] cursor-pointer border-[1px] border-solid border-tab rounded-[10px]
                text-base transition-colors duration-150"/>
                    </div>

                    <div className="mb-4"  >
                <label htmlFor="descricao" className="block  font-medium text-profile  mb-2">Descrição
                     </label>
                     <textarea name="descricao" id="descricao" required className=" w-full rounded-[10px] text-base border-[1px] border-solid 
                   p-[0.8rem] border-tab min-h-[120px] resize-y "></textarea>
                </div>

                <div className="w-full  mb-4 border-[2px] min-h-[80px] border-dashed hover:border-marieth border-tab  text-center 
                transition-all duration-150 cursor-pointer rounded-[10px]" >
                    <label htmlFor="" className="block  font-medium text-profile  mb-2" >
                        <p className="font font-medium mt-4 ">Clique e arraste a foto</p>
                    </label>
                </div>
                
                    <div className=" flex justify-between">
                    <button type="submit"className="bg-vermelho text-white py-4 px-8 text-base  cursor-pointer  
                font-medium transition-colors duration-150 hover:bg-red-400 mt-4 flex  border-none rounded-[10px]" >
                    Cancelar
      </button>

                <button type="submit"className="bg-marieth text-white py-4 px-8 text-base  cursor-pointer  
                font-medium transition-colors duration-150 hover:bg-verdeaceso mt-4 flex  border-none rounded-[10px]" >
        Cadastrar 
      </button>
      </div>
            </div>
            

</div>
            <Footer/>
        </main>
    )
 }