import { FaLuggageCart } from "react-icons/fa";
 import { GiFarmer} from "react-icons/gi";
 import { TiShoppingCart } from "react-icons/ti";
 import Head from "next/head"
 import Link from "next/link";
import Footer from "../Components/Footer";

 
 
 export default function SelectPage(){ 
 
     return(
         <div >
           <Head>
                 <title>Seleccionar Perfil</title>
             </Head>
         <div>
         <div  className="p-6 text-center text-white  bg-primary">
           <h1 className="text-[32px] font-bold">Escolha seu Perfil</h1>
           </div >
           
           <main className="max-w-[75rem] mt-8  mx-auto">
 
         <h2 className="mb-10 text-center text-cortexto"> Selecciona o tipo de perfil que melhor se adequa a tua actividade no sistema</h2>
         </main>         
         </div>
 
          <div className="bg-white grid grid-cols-1 lg:grid-cols-3" >

           <div className=" ml-8 mb-20 bg-white rounded-[15px]  p-8 text-center max-w-[300px] 
            cursor-pointer shadow-custom hover:translate-y-2 lg:ml-16">
           
                 <div className=" w-20 h-10 m-0 mx-auto mb-6 ">
                    <GiFarmer className=" w-full h-full fill-primary"/>
                </div>
                         <div className=" text-2xl  text-profile"> Agricultor </div>
                         <div className="mb-6 text-cortexto ">Venda seus produtos diretamente para compradores e aumente suas vendas com facilidade </div>
                         
                         <button className=" hover:bg-verdeaceso  cursor-pointer w-full text-base
                          text-white rounded-[5px]  border-none bg-primary py-3 px-6" >
                            <Link href="./Cadastroagricultor">Seleccionar Perfil</Link></button>
          </div>
          
         
         
       <div className=" ml-8 hover:translate-y-2 bg-white rounded-[15px] p-8 text-center mb-24 max-w-[300px] cursor-pointer shadow-custom lg:mb-20" > 
       
       <div className=" w-20 h-10 m-0 mx-auto mb-6 ">
                    < TiShoppingCart className=" w-full h-full fill-primary " />
                </div>
         <div className=" text-2xl  text-profile" > Comprador</div>
                     <div className="mb-6 text-cortexto ">
                       Descubra e adquira produtos frescos  directacmente dos agricultores de forma simples e rápida
                     </div>
                   
                     <button className=" hover:bg-verdeaceso cursor-pointer w-full text-base text-white rounded-[5px] border-none bg-primary py-3 px-6">
                       <Link href="./Cadastrocomprador">Seleccionar Perfil</Link></button>
                 </div>
            
        <div className="ml-8 hover:translate-y-2  bg-white rounded-[15px] p-8 text-center mb-24 max-w-[300px] cursor-pointer shadow-custom transition-transform lg:mb-20" >
                <div className=" ml-8 w-20 h-10 lg:m-0 mx-auto mb-6 ">
                    <FaLuggageCart className=" w-full h-full fill-primary " />
                </div>
                 <div className=" text-2xl  text-profile" > Fornecedor</div>
                 <div className="mb-6 text-cortexto ">Ofereça insumos agricolas para agricultores e aumente suas vendas com facilidade</div>
                 
               <button className="hover:bg-verdeaceso cursor-pointer w-full text-base text-white rounded-[5px] border-none bg-primary py-3 px-6" >
                 <Link href="./cadastrofornecedor">Seleccionar Perfil</Link> </button>
 </div>
             
   
 
    
    
 
 
 
 
   </div>
     <Footer/> 
 </div>
                    
                      
 
  
 );
 }