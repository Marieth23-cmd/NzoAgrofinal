"use client"
import Image from "next/image"
import { AiFillBell, AiFillBilibili, AiFillHome, AiOutlineShoppingCart } from "react-icons/ai"
import { BiBarChartSquare } from "react-icons/bi"
import { IoPersonCircleOutline } from "react-icons/io5"
import Link from "next/link"
import { useState , useEffect } from "react"
import { verificarAuth } from "../Services/auth"
import { useRouter } from "next/navigation"
import { getUsuarioById } from "../Services/user"
import Cookies from "js-cookie"



export default function Navbar() {
    const [tipoUsuario, setTipoUsuario] = useState<string | null>(null)

    const [autenticado ,setAutenticado]=useState <Boolean | null> (null)
    const router=useRouter()

    
    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
          setAutenticado(false);
          return;
        }
      
        const checar = async () => {
          try {
            await verificarAuth();
            setAutenticado(true);
            const usuario = await getUsuarioById();
            setTipoUsuario(usuario.tipo_usuario);
          } catch (error) {
            setAutenticado(false);
          }
        };
      
        checar();
      }, []);
      
   
    const redirecionar = (rotaPersonalizada?: string):void => {
        if (!autenticado) {
            router.push("/login")
            return
        }
    
        if (rotaPersonalizada) {
            router.push(rotaPersonalizada)
            return
        }
    
        if (tipoUsuario === "Comprador") {
            router.push("/perfilcomprador")
        } else if (tipoUsuario === "Agricultor") {
            router.push("/perfilagricultor")
        } else if (tipoUsuario === "Fornecedor") {
            router.push("/perfilfornecedor")
        } else {
            router.push("/") 
        }
    }
    


    return (

        <nav className=" flex justify-between max-w-full  -mt-[11rem] border-b-[1px] 
         bg-white p-2 shadow-sm top-0 sticky z-[100] ">

            <div className=" flex items-center max-w-[75rem]"  >
                <div className=" flex items-center gap-4 ">
                    <Image src="/images/logo.jpg" alt="logotipo" width={55} height={55}/>
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
                onClick={()=>redirecionar()}> 
                    <IoPersonCircleOutline className="gap-2  text-[1.4rem] ml-2  mt-[0.2rem]" />
                    <span className="hidden lg:block">Perfil</span>  
                    </li>

            </ul>





        </nav>
    )

}