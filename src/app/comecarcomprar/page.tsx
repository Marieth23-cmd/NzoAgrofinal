import { GrAction } from "react-icons/gr";
import Footer from "../Components/Footer";
import { FaApple, FaAppleAlt, FaCarrot, FaSeedling } from "react-icons/fa";
import { GiCabbage } from "react-icons/gi";
import Navbar from "../Components/Navbar";
import Link from "next/link";
import Head from "next/head";

 
 export default  function   ComecarComprar(){ 
    return(
        <main>
            <Head>
                <title>Começar a Comprar</title>
                    
            </Head>
                 <Navbar/>
            <div className="p-8 mb-8 mx-auto mt-[30%] text-center  max-w-[800px] lg:mt-[15%]">
                <h1  className=" text-[2rem] mb-6 text-marieth font-bold" >Bem-vindo à NzoAgro!</h1>
                <p className="mb-8 text-[1.2rem]  text-profile ">Para começar suas compras, selecione uma categoria abaixo ou explore todos os nossos produtos disponíveis. 
                    Temos uma grande variedade de produtos agrícolas de alta qualidade esperando por você!</p>
                    <a  className=" bg-marieth text-white py-4 px-8 border-none rounded-[5px]
                     text-[1.1rem] cursor-pointer inline-block hover:bg-verdeaceso transition-colors duration-150 
             " href="./TodosProdutos">Ver Todos os Produtos</a>
                    <div className=" grid grid-cols-2 ">
                    <div className="  mt-12 py-0  px-8" >
                        <div className=" flex items-center justify-center  rounded-[10px] text-center p-8 lg:p-6 cursor-pointer shadow-custom  bg-branco transition-colors duration-150 ease-in-out hover:translate-y-2 " >
                            <h1 className="mt-[0.5rem] font-bold text-[18.72px] text-profile" >
                                <Link  href="./categoriafrutas"> <FaAppleAlt className =" text-marieth text-[2.5rem] " />  Fruta </Link>
                                </h1>
                        </div>
                    </div  >
                    <div className="  gap-8 mt-12 py-0 px-8 ">
                        
                        <div className=" flex items-center justify-center  rounded-[10px] text-center p-8 lg:p-6 cursor-pointer bg-branco  shadow-custom transition-colors duration-150 ease-in-out hover:translate-y-2" >
                            <h1 className="mt-[0.5rem] font-bold text-[18.72px] text-profile" >
                              <Link href="./categoriaverdura"><GiCabbage className =" ml-3 text-marieth text-[2.5rem]" /> Verduras
                              </Link>       
                                 </h1>
                        </div>
                    </div>

                    <div className="gap-2  p-8"  >
                        <div className="flex items-center justify-center rounded-[10px] text-center p-8 lg:p-6 cursor-pointer shadow-custom bg-branco transition-colors duration-150 ease-in-out hover:translate-y-2 " >
                            <h1 className="mt-[0.5rem] font-bold text-[18.72px] text-profile" >
                            <Link href="./categoriainsumo">< FaSeedling className="ml-12 text-marieth text-[2.5rem]" /> Insumos Agrícolas
                            </Link>                                   
                             </h1>
                        </div>
                    </div>

                    <div className="gap-8  p-8" >
                        <div className=" flex items-center justify-center  rounded-[10px] text-center p-8 lg:p-6  cursor-pointer shadow-custom transition-colors duration-150 ease-in-out hover:translate-y-2 bg-branco ">
                            <h1 className="font-bold text-[18.72px] text-profile mt-[0.5rem]" > 
                               <Link href="./categoriatuberraiz"> <FaCarrot className="  text-marieth text-[2.5rem] ml-12 "  /> Tubérculos e Raízes </Link>      
                               </h1>
                        </div>
                    </div>
            </div>

            </div>

            <Footer/>

        </main>
    )
 }