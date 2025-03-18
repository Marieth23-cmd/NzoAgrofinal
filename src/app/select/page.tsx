import { AiFillCar } from "react-icons/ai";
import { FaLuggageCart } from "react-icons/fa";
import { GiFarmer} from "react-icons/gi";
import { TiShoppingCart } from "react-icons/ti";


export default function select(){

    return(
        <div >
          <head>
                <title>Seleccionar Perfil</title>
            </head>
        <div>
        <div  className=" p-6 text-center text-white  bg-primary">
          <h1 className="text-[32px] font-bold">Escolha seu  Perfil</h1>
          </div >
          
          <main className="   max-w-[75rem] my-8  mx-auto">

        <h2 className="  mb-8 text-center text-cortexto"> Selecciona o tipo de perfil que melhor se adequa a tua actividade no sistema</h2>
        </main>         
        </div>

         <div className="bg-white  mt-8 gap-8  grid grid-cols-2" >
          <div className="ml-80 bg-white rounded-[15px] p-8 text-center max-w-[300px]  cursor-pointer shadow-custom ">
          
                <div className=" w-20 h-20 m-0 mx-auto mb-6 ">
                   <GiFarmer className=" w-full h-full fill-primary " />
               </div>
                        <div className=" text-2xl  text-profile  " > Agricultor </div>
                        <div className="mb-6 text-cortexto ">Venda seus produtos diretamente para compradores e gerencie sua produção agrícola</div>
                        
                        <button className=" hover:bg-verdeaceso  cursor-pointer w-full text-base text-white rounded-[5px]  border-none bg-primary py-3 px-6" >Seleccionar Perfil</button>
         </div>
         
        
        
      <div className="bg-white rounded-[15px] p-8 text-center max-w-[300px] cursor-pointer shadow-custom   "> 
      
      <div className=" w-20 h-20 m-0 mx-auto mb-6 ">
                   < TiShoppingCart className=" w-full h-full fill-primary " />
               </div>
        <div className=" text-2xl  text-profile  " > Comprador</div>
                    <div className="mb-6 text-cortexto ">
                      Descubra e adquira produtos frescos  directacmente dos agricultores de forma simples e rápida
                    </div>
                  
                    <button className=" hover:bg-verdeaceso cursor-pointer w-full text-base text-white rounded-[5px] border-none bg-primary py-3 px-6">Seleccionar Perfil</button>
                </div>
           
       <div className=" ml-80 bg-white rounded-[15px] p-8 text-center max-w-[300px] cursor-pointer shadow-custom transition-transform " >
               <div className=" w-20 h-20 m-0 mx-auto mb-6 ">
                   <FaLuggageCart className=" w-full h-full fill-primary " />
               </div>
                <div className=" text-2xl  text-profile  " > Fornecedor</div>
                <div className="mb-6 text-cortexto ">Ofereça insumos agricolas para agricultores e aumente suas vendas com facilidade</div>
                
              <button className="hover:bg-verdeaceso cursor-pointer w-full text-base text-white rounded-[5px] border-none bg-primary py-3 px-6" >Seleccionar Perfil</button>
</div>
            
  

   
   <div className="bg-white rounded-[15px] p-8 text-center cursor-pointer max-w-[300px] shadow-custom transition-transform " >
                  <div className=" w-20 h-20 m-0 mx-auto mb-6 ">
                   <AiFillCar className=" w-full h-full fill-primary " />
               </div>
                <div className=" text-2xl  text-profile  "> Motorista</div>
                <div className="mb-6 text-cortexto  ">Realize o transporte de produtos entre agricultores , fornecedores e compradores</div>
              
                <button className=" hover:bg-verdeaceso cursor-pointer w-full text-base text-white rounded-[5px] border-none bg-primary py-3 px-6" >Seleccionar Perfil</button>
                
                </div>
                




  </div>

</div>
                   
                     

 
);
}