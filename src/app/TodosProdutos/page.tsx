
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Image from "next/image";
import { BiStar } from "react-icons/bi";
import { FaRegStarHalfStroke } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";

export default function Vitrine(){
    return(
        <div>

            
            <head>
                <title>
                Ver todos os Produtos
                </title>
            </head>
            <Navbar/>   

        <div className="flex flex-col mb-20 gap-2 mt-[15%] max-w-[1200px] shadow-custom p-8  rounded-[10px] ml-8">

            <div className=" p-8">
                <div className="productos-grid">

                <div className="overflow-hidden bg-white rounded-[0.625rem] shadow-custom 
                transition-transform duration-150 ease-in-out 
                 transform hover:translate-y-[0.3125rem]">
                    <Image src="/images/hortaliciA.jpg" alt="kjwdiwoed" height={200} width={0} className="w-full object-cover"/>
                    <div className="p-6">        
                          <h3 className="text[1.2rem] mb-2 text-profile" >Sementes de Milho Premium</h3>
                    
                    <div className=" flex mb-2">
                       
                        <FaStar className=" text-amarela"/>
                        <FaStar className=" text-amarela"/>
                        <FaStar className=" text-amarela"/>
                        <FaStar className=" text-amarela"/>
                        <FaRegStarHalfStroke className=" fill-amarela" />
                        <span className="text-amarela -mt-[4px]">(4.5)</span>
                    </div>
                    <p className="text-[1.3rem] font-bold mb-4 text-marieth"> <span>1/tonelada</span> AOA 50.000</p>
                     <div className=" flex flex-col gap-2">
                        <button className="text-marieth py-2  cursor-pointer px-4 transition-all duration-150
                         ease-in-out border-[1px] border-solid bg-cinza rounded-[0.3125rem] hover:bg-marieth hover:text-white"> Ver detalhes</button>
                        <button className=" hover:bg-verdeaceso  py-2  cursor-pointer px-4 text-white bg-marieth transition-colors duration-150 ease-in-out rounded-[0.3125rem]">Adicionar ao Carrinho</button>
                 </div>   
                  </div>

                </div>
                <div className="overflow-hidden bg-white rounded-[0.625rem] shadow-custom 
                transition-transform duration-150 ease-in-out
                 transform hover:translate-y-[0.3125rem]">
                    <Image src="/images/hortaliciA.jpg" alt="kjwdiwoed" height={200} width={0} className="w-full object-cover"/>
                    <div className="p-6">        
                          <h3 className="text[1.2rem] mb-2 text-profile" >Sementes de Milho Premium</h3>
                    
                    <div className=" flex mb-2">
                       
                        <FaStar className=" text-amarela"/>
                        <FaStar className=" text-amarela"/>
                        <FaStar className=" text-amarela"/>
                        <FaStar className=" text-amarela"/>
                        <FaRegStarHalfStroke className=" fill-amarela" />
                        <span className="text-amarela -mt-[4px]">(4.5)</span>
                    </div>
                    <p className="text-[1.3rem] font-bold mb-4 text-marieth"> <span>1/tonelada</span> AOA 50.000</p>
                     <div className=" flex flex-col gap-2">
                        <button className="text-marieth py-2  cursor-pointer px-4 transition-all duration-150
                         ease-in-out border-[1px] border-solid bg-cinza rounded-[0.3125rem] hover:bg-marieth hover:text-white"> Ver detalhes</button>
                        <button className=" hover:bg-verdeaceso  py-2  cursor-pointer px-4 text-white bg-marieth transition-colors duration-150 ease-in-out rounded-[0.3125rem]">Adicionar ao Carrinho</button>
                 </div>   
                  </div>

                </div>

                <div className="overflow-hidden bg-white rounded-[0.625rem] shadow-custom 
                transition-transform duration-150 ease-in-out
                 transform hover:translate-y-[0.3125rem]">
                    <Image src="/images/hortaliciA.jpg" alt="kjwdiwoed" height={200} width={0} className="w-full object-cover"/>
                    <div className="p-6">        
                          <h3 className="text[1.2rem] mb-2 text-profile" >Sementes de Milho Premium</h3>
                    
                    <div className=" flex mb-2">
                       
                        <FaStar className=" text-amarela"/>
                        <FaStar className=" text-amarela"/>
                        <FaStar className=" text-amarela"/>
                        <FaStar className=" text-amarela"/>
                        <FaRegStarHalfStroke className=" fill-amarela" />
                        <span className="text-amarela -mt-[4px]">(4.5)</span>
                    </div>
                    <p className="text-[1.3rem] font-bold mb-4 text-marieth"> <span>1/tonelada</span> AOA 50.000</p>
                     <div className=" flex flex-col gap-2">
                        <button className="text-marieth py-2  cursor-pointer px-4 transition-all duration-150
                         ease-in-out border-[1px] border-solid bg-cinza rounded-[0.3125rem] hover:bg-marieth hover:text-white"> Ver detalhes</button>
                        <button className=" hover:bg-verdeaceso  py-2  cursor-pointer px-4 text-white bg-marieth transition-colors duration-150 ease-in-out rounded-[0.3125rem]">Adicionar ao Carrinho</button>
                 </div>   
                  </div>

                </div>


                <div className="overflow-hidden bg-white rounded-[0.625rem] shadow-custom 
                transition-transform duration-150 ease-in-out
                 transform hover:translate-y-[0.3125rem]">
                    <Image src="/images/hortaliciA.jpg" alt="kjwdiwoed" height={200} width={0} className="w-full object-cover"/>
                    <div className="p-6">        
                          <h3 className="text[1.2rem] mb-2 text-profile" >Sementes de Milho Premium</h3>
                    
                    <div className=" flex mb-2">
                       
                        <FaStar className=" text-amarela"/>
                        <FaStar className=" text-amarela"/>
                        <FaStar className=" text-amarela"/>
                        <FaStar className=" text-amarela"/>
                        <FaRegStarHalfStroke className=" fill-amarela" />
                        <span className="text-amarela -mt-[4px]">(4.5)</span>
                    </div>
                    <p className="text-[1.3rem] font-bold mb-4 text-marieth"> <span>1/tonelada</span> AOA 50.000</p>
                     <div className=" flex flex-col gap-2">
                        <button className="text-marieth py-2  cursor-pointer px-4 transition-all duration-150
                         ease-in-out border-[1px] border-solid bg-cinza rounded-[0.3125rem] hover:bg-marieth hover:text-white"> Ver detalhes</button>
                        <button className=" hover:bg-verdeaceso  py-2  cursor-pointer px-4 text-white bg-marieth transition-colors duration-150 ease-in-out rounded-[0.3125rem]">Adicionar ao Carrinho</button>
                 </div>   
                  </div>

                </div>


                <div className="overflow-hidden bg-white rounded-[0.625rem] shadow-custom 
                transition-transform duration-150 ease-in-out
                 transform hover:translate-y-[0.3125rem]">
                    <Image src="/images/hortaliciA.jpg" alt="kjwdiwoed" height={200} width={0} className="w-full object-cover"/>
                    <div className="p-6">        
                          <h3 className="text[1.2rem] mb-2 text-profile" >Sementes de Milho Premium</h3>
                    
                    <div className=" flex mb-2">
                       
                        <FaStar className=" text-amarela"/>
                        <FaStar className=" text-amarela"/>
                        <FaStar className=" text-amarela"/>
                        <FaStar className=" text-amarela"/>
                        <FaRegStarHalfStroke className=" fill-amarela" />
                        <span className="text-amarela -mt-[4px]">(4.5)</span>
                    </div>
                    <p className="text-[1.3rem] font-bold mb-4 text-marieth"> <span>1/tonelada</span> AOA 50.000</p>
                     <div className=" flex flex-col gap-2">
                        <button className="text-marieth py-2  cursor-pointer px-4 transition-all duration-150
                         ease-in-out border-[1px] border-solid bg-cinza rounded-[0.3125rem] hover:bg-marieth hover:text-white"> Ver detalhes</button>
                        <button className=" hover:bg-verdeaceso  py-2  cursor-pointer px-4 text-white bg-marieth transition-colors duration-150 ease-in-out rounded-[0.3125rem]">Adicionar ao Carrinho</button>
                 </div>   
                  </div>

                </div>

                <div className="overflow-hidden bg-white rounded-[0.625rem] shadow-custom 
                transition-transform duration-150 ease-in-out
                 transform hover:translate-y-[0.3125rem]">
                    <Image src="/images/hortaliciA.jpg" alt="kjwdiwoed" height={200} width={0} className="w-full object-cover"/>
                    <div className="p-6">        
                          <h3 className="text[1.2rem] mb-2 text-profile" >Sementes de Milho Premium</h3>
                    
                    <div className=" flex mb-2">
                       
                        <FaStar className=" text-amarela"/>
                        <FaStar className=" text-amarela"/>
                        <FaStar className=" text-amarela"/>
                        <FaStar className=" text-amarela"/>
                        <FaRegStarHalfStroke className=" fill-amarela" />
                        <span className="text-amarela -mt-[4px]">(4.5)</span>
                    </div>
                    <p className="text-[1.3rem] font-bold mb-4 text-marieth"> <span>1/tonelada</span> AOA 50.000</p>
                     <div className=" flex flex-col gap-2">
                        <button className="text-marieth py-2  cursor-pointer px-4 transition-all duration-150
                         ease-in-out border-[1px] border-solid  bg-cinza rounded-[0.3125rem] hover:bg-marieth hover:text-white"> Ver detalhes</button>
                        <button className=" hover:bg-verdeaceso  py-2 
                        cursor-pointer px-4 text-white bg-marieth transition-colors  ease-in-out rounded-[0.3125rem]">Adicionar ao Carrinho</button>
                 </div>   
                  </div>

                </div>



                    






                </div>
            </div>
            <button className="block my-8 mx-auto bg-marieth cursor-pointer text-[1.1rem]
             text-white py-4 px-8 rounded-[0.3125rem] transition-colors ease-in-out hover:bg-verdeaceso">Ver mais Produtos</button>


        </div>


            <Footer/>

        </div>
    )
}
