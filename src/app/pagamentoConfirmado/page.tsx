 import Navbar from "../Components/Navbar"
 import { FaRegCheckCircle } from "react-icons/fa";
 import Footer from "../Components/Footer";
 

export default function PagamentoConfirmado (){
    return(
        
       
            <div> 
                <head>
                <title>Pagamento Confirmado</title>
            </head> 
                <Navbar/>
           <main  className=" flex flex-col  justify-center items-center  gap-3  m-40  mt-[15%]">
            
              
                <div className=" w-[68%] rounded-[15px] bg-white p-8  text-center shadow-custom ">
                    <div  >
                <FaRegCheckCircle className="h-[100px] w-[100px] my-8 mx-auto fill-marieth" />
                </div>

                <div className=" text-[1.8rem] text-marieth my-4 mx-0">Pagamnto Confirmado! </div>
                <p className=" text-[1.1rem]  m-4 text-profile my-4 mx-0">Seu pedido foi processado com sucesso.</p>
                <div className="text-marieth font-mono my-4 mx-0 text-[1.2rem]">Pedido #2024-0123</div>

                <div className=" p-6 rounded-[10px] m-8  text-left bg-light">
                        
                        <div className=" flex    justify-between text-profile my-3 mx-0" >
                           <h1 className="font-medium">Metodo de Pagamento:</h1>
                            <h1  > Cartão de Crédito •••• 4321</h1>
                        </div > 

                        <div className="flex  justify-between text-profile my-3 mx-0 " >
                            <h1 className="font-medium" > Data:</h1>
                            <p id="currentDate"></p>              
                             </div >

                         <div className="flex  justify-between text-profile my-3 mx-0 " >
                            <h1 className="font-medium" >Valor Total:</h1>
                            <h1> KZ 250,0</h1>
                             </div>
        </div>
                
                <div className=" flex mt-8 gap-4 justify-center">
                    <button className=" text-white bg-marieth cursor-pointer border-none
                     rounded-[5px] text-base font-medium py-3 px-8 hover:bg-verdeaceso transition-all duration-300 ease-in-out "> Ver Detalhes de Pedido</button>
               </div> 
               </div>

            </main>

            <Footer/>

</div>

    )
}