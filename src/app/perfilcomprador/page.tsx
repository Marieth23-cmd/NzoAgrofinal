import { FaStar } from "react-icons/fa";
import Navbar from "../Components/Navbar";
import { FaRegStarHalfStroke } from "react-icons/fa6";
import { TfiEmail } from "react-icons/tfi";
import { IoCall } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import Footer from "../Components/Footer";

 export default function perfilcomprador(){
    return(
         
        <div>
            <header> <title>Perfil Comprador</title></header>
            <Navbar/>
            <div className=" flex flex-col mb-20   gap-2 mt-[14%]  max-w-[1200px] shadow-custom ml-8">
                
            <main className="my-8  p-8 max-w-[75rem]">
    <div  className="profilheader">
      <div className="w-[12.5rem] h-[12.5rem] rounded-[50%] flex items-center text-[4rem] justify-center text-cortime bg-cinzab" >
       
      </div>
      <div className="flex flex-col gap-4" >
        <h1 className="text-[2rem] text-profile" >Carlos Santos</h1>
        <div className=" text-[1.2rem] hidden">
                                 <FaStar className=" text-amarela"/>
                                 <FaStar className=" text-amarela"/>
                                 <FaStar className=" text-amarela"/>
                                 <FaStar className=" text-amarela"/>
                                 <FaRegStarHalfStroke className=" text-amarela" />

        </div>
        <span className="text-amarela text-[1.2rem]" >(4.5)</span>
        <p >Membro desde: Março 2023</p>
        <p>Especialidade: Produtos Agrícolas</p>
        <div className=" flex gap-4">
          <button className=" flex items-center gap-2 py-2 px-4 rounded-[0.3125rem] text-[1rem] bg-marieth 
        transition-colors  cursor-pointer text-white hover:bg-verdeaceso">
            <MdEmail/>
            Email
            
          </button>
          <button   className=" flex items-center gap-2 py-2 px-4 rounded-[0.3125rem] text-[1rem] bg-padding 
        transition-colors  cursor-pointer text-white">
            <IoCall/>
            Ligar
          </button>
        </div>
      </div>
    </div>

    <div className="mt-8">
      <h2 className="mb-6 text-profile font-semibold">Histórico de Compras</h2>
      <div className="grid gap-4">
        <div className="flex gap-8 rounded-[0.625rem] p-6 bg-list ">
          <div className="font-medium text-cortime flex-[0_0_100px]">15 Mai 2023</div>
          <div className="flex-1">
            <h3 className="text-[1.17rem] m-0 mb-2">Pedido #12345</h3>
            <div className=" flex gap-4 mb-2 flex-wrap">
              <span className="bg-white rounded-[0.625rem] text-[0.9rem] text-cortime py-[0.3rem] px-[0.8rem]" >Tomates (50kg)</span>
              <span className="bg-white rounded-[0.625rem] text-[0.9rem] text-cortime py-[0.3rem] px-[0.8rem]" >Batatas (100kg)</span>
              <span className="bg-white rounded-[0.625rem] text-[0.9rem] text-cortime py-[0.3rem] px-[0.8rem]" >Cebolas (30kg)</span>
            </div>
            <div className="text-white bg-marieth">Entregue</div>
            <div className="mt-2 font-semibold text-profile">R$ 2.500,00</div>
          </div>
        </div>

        <div className="flex gap-8 rounded-[0.625rem] p-6 bg-list">
          <div className="text-[1.17rem] m-0 mb-2">10 Mai 2023</div>
          <div className="flex-1">
            <h3 className="text-[1.17rem] m-0 mb-2">Pedido #12344</h3>
            <div className="flex  gap-4 flex-wrap mb-2">
              <span className=" bg-white rounded-[0.625rem] text-[0.9rem] text-cortime py-[0.3rem] px-[0.8rem]">Alface (20kg)</span>
              <span className=" bg-white rounded-[0.625rem] text-[0.9rem] text-cortime py-[0.3rem] px-[0.8rem]">Cenouras (40kg)</span>
            </div>
            <div className="text-white bg-marieth">Entregue</div>
            <div className="mt-2 font-semibold text-profile">R$ 1.800,00</div>
          </div>
        </div>

        <div className="flex gap-8 rounded-[0.625rem] p-6 bg-list">
          <div className="text-[1.17rem] m-0 mb-2">5 Mai 2023</div>
          <div className="flex-1">
            <h3 className="text-[1.17rem] m-0 mb-2">Pedido #12343</h3>
            <div className="product-list">
              <span>Maçãs (200kg)</span>
              <span>Peras (150kg)</span>
            </div>
            <div className="text-white bg-padding">Em Andamento</div>
            <div className="history-price">R$ 3.200,00</div>
          </div>
        </div>
      </div>
    </div>
  


    
    
           
           
           













           </main> 
           
            </div>
            <Footer/>
         </div>






    )
 }