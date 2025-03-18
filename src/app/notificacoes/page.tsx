 import { GiRaining } from "react-icons/gi"
import Navbar from "../Components/Navbar"
 import Footer from "../Components/Footer"

 export default function notificacoes(){
    return(
        <main>   
        <Navbar/>  
        <div   className=" flex flex-col mb-20   gap-2 mt-[14%]  max-w-[1200px] shadow-custom ml-8" >  
             <h1 className=" text-[2rem] text-marieth mt-[80px] p-4 font-bold ">Notificações</h1>
   
     <div className="flex  p-0 border-b ">

     <div className=" text-marieth border-b-2 border-marieth p-4">Todas</div>
    <div className=" p-4 border-b-2-transparent cursor-pointer">Não lidas</div>
   </div>
            <div className=" flex  flex-col items-start  p-4  gap-4 ">
     
      <div className="  flex-1 border-b ">
     <h3 className=" font-bold mb-2 text[1.1rem]" >Nova mensagem</h3>
     <div  className="text-cortexto"> João enviou uma mensagem sobre sua última compra. </div>
     <div className="text-sm text-cortime " >Há 5 minutos</div>
         </div> 
                            
<div className="  flex-1 border-b">
    <h3 className=" font-bold mb-2 text[1.1rem]" >Atualização do pedido</h3>
    <div  className="text-cortexto"> Seu pedido #123456 foi enviado.</div>
<p className="text-sm text-cortime ">Há 2 horas</p>
</div>
   
   <div className="  flex-1 border-b">
    <h3 className=" font-bold mb-2 text[1.1rem]" >   Novidade</h3>
    <div className="text-cortexto"> Novos produtos disponíveis em nossa loja!</div>
    <p className="text-sm  text-cortime" >    Há 1 dia</p>
   </div>
   <div className="  flex-1 border-b">
    <h3 className=" font-bold mb-2 text[1.1rem]" >   Novidade</h3>
    <div className="text-cortexto"> Novos produtos disponíveis em nossa loja!</div>
    <p className="text-sm  text-cortime" >    Há 1 dia</p>
   </div>

   </div>
   
   </div>
   <Footer/>
    </main>

    )
 }