"use client"
import Image from "next/image"
import { AiFillBell, AiFillBilibili, AiFillHome, AiOutlineShoppingCart } from "react-icons/ai"
import { BiBarChartSquare } from "react-icons/bi"
import { HiOutlineArrowLeft } from "react-icons/hi2"
import { IoPersonCircleOutline } from "react-icons/io5"
import Link from "next/link"
import { useState , useEffect } from "react"
import { verificarAuth } from "../Services/auth"
import { useRouter } from "next/navigation"

export default function Navbar() {
 
    const [autenticado ,SetAutenticado]=useState <Boolean | null> (null)
    const router=useRouter()

    useEffect(()=>{
       const checar= async()=>{
        try {
           await verificarAuth()
           SetAutenticado(true)
            
        } catch (error) {
            SetAutenticado(false)
            
        }

        }
        checar()

    } ,[])

    const redirecionar=(path:string)=>{
        if(autenticado){
            router.push(path)
            }
            else{
                router.push("./login")
            }

    }



    return (

        <nav className=" flex justify-between max-w-full  -mt-[11rem] border-b-[1px] 
         bg-white p-2 shadow-sm top-0 sticky z-[100] ">

            <div className=" flex items-center max-w-[75rem]"  >
                <div className=" flex items-center gap-4 ">
                    <Image src="/images/nzoagro.png" alt="logotipo" width={50} height={50}/>
                    <p className="text-2xl text-marieth font-bold">NzoAgro</p>
                </div >
            </div>

            <ul className="   ml-[33rem] gap-8 hidden lg:flex">
                <li className="  text-[1.2rem] cursor-pointer hover:text-marieth "> 
                    <Link href="./"> <AiFillHome className="gap-2 text-[1.4rem] ml-2  mt-[0.1rem]" /> 
                    <span>Inicio</span></Link> </li>
                
                
                <li className="  text-[1.2rem] cursor-pointer hover:text-marieth "
                 onClick={()=>redirecionar("./carrinho")}>
                      <AiOutlineShoppingCart className="gap-2 text-[1.4rem] ml-5 mt-[0.1rem] " />  
                     <span className="hidden lg:block ">Carrinho</span>
                     </li>
                
                <li className=" text-[1.2rem] cursor-pointer hover:text-marieth "
                 onClick={()=>redirecionar("./notificacoes")}> 
                    <AiFillBell className="gap-2   text-[1.4rem] ml-7 mt-[0.1rem]" /> 
                    <span className="hidden lg:block">Notificações</span>   
                    </li>
                
                
                <li className="  text-[1.2rem] cursor-pointer hover:text-marieth "
                onClick={()=>redirecionar("./relatoriocomprador")}>
                     <BiBarChartSquare className="gap-2 ml-6 text-[1.4rem]  mt-[0.2rem]" /> 
                    <span className="hidden lg:block">Relatórios</span>
                    </li>
                
                <li className="  text-[1.2rem] cursor-pointer hover:text-marieth "
                onClick={()=>redirecionar("./perfilcomprador")}> 
                    <IoPersonCircleOutline className="gap-2  text-[1.4rem] ml-2  mt-[0.2rem]" />
                    <span className="hidden lg:block">Perfil</span>  
                    </li>

            </ul>





        </nav>
    )

}