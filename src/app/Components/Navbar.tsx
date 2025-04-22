"use client"
import Image from "next/image"
import { AiOutlineShoppingCart } from "react-icons/ai"
import { BiBarChartSquare } from "react-icons/bi"
import { GoHome } from "react-icons/go";
import { IoPersonCircleOutline } from "react-icons/io5"
import Link from "next/link"
import { IoMdNotificationsOutline } from "react-icons/io";
import { verificarAuth } from "../Services/auth"
import { useRouter } from "next/navigation"
import { getUsuarioById } from "../Services/user"
import { FaBars } from "react-icons/fa"
import React, { useState,useCallback, useRef, useEffect  } from 'react';
import { logout } from "../Services/auth";



export default function Navbar() {
    const [tipoUsuario, setTipoUsuario] = useState<string | null>(null)
    const [menuAberto, setMenuAberto] = useState(false)
    const [autenticado ,setAutenticado]=useState <Boolean | null> (null)
    const router=useRouter()
    const [isopen , setIsOpen]=useState(false)
     const boxref=useRef <HTMLDivElement>(null)



   
     useEffect(() => {
      const checar = async () => {
        try {
          const authResponse = await verificarAuth();
          if (!authResponse) {
            setAutenticado(false);
            return;
          }
    
          setAutenticado(true);
    
          const usuario = await getUsuarioById();
          console.log("Usuário retornado pela API:", usuario); 
          if (usuario && usuario.tipo_usuario) {
            setTipoUsuario(usuario.tipo_usuario);
            console.log("Usuário autenticado:", usuario);
          } else {
            console.log("Tipo de usuário não encontrado.");
          }
    
        } catch (error) {
          console.log("Erro ao verificar autenticação:", error);
          setAutenticado(false);
        }
      };
    
      checar();
    }, []);
    
      
      
console.log("Tipo de usuário:", tipoUsuario);
const redirecionar = (rotaPersonalizada?: string): void => {
  if (autenticado === null || tipoUsuario === null) {
    console.log("Aguardando autenticação ou tipo de usuário...");
    return;
  }

  if (!autenticado) {
    router.push("/login");
    return;
  }

  if (rotaPersonalizada) {
    router.push(rotaPersonalizada);
    return;
  }

  if (tipoUsuario === "Comprador") {
    router.push("/perfilcomprador");
  } else if (tipoUsuario === "Agricultor") {
    router.push("/perfilagricultor");
  } else if (tipoUsuario === "Fornecedor") {
    router.push("/perfilfornecedor");
  } else {
    console.log("Tipo de usuário desconhecido:", tipoUsuario);
    router.push("/");
  }
}


  const handleClick = useCallback((event: MouseEvent) => {
    if (boxref.current && !boxref.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isopen) {
      document.addEventListener("mousedown", handleClick);
    } else {
      document.removeEventListener("mousedown", handleClick);
    }

       return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [isopen, handleClick]);


  const handleLogout = async () => {
    try {
      await logout();
      setAutenticado(false); 
      router.push("/login");
    } catch (error) {
      console.error("Erro ao terminar sessão:", error);
    }
  };
  


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
                    <Link href="./"> <GoHome className="gap-2 text-[1.4rem] ml-2  mt-[0.1rem]" /> 
                    <span>Inicio</span></Link> </li>
                
                
                <li className="  text-[1.2rem] cursor-pointer hover:text-marieth "
                 onClick={()=>redirecionar("./carrinho")}>
                      <AiOutlineShoppingCart className="gap-2 text-[1.4rem] ml-5 mt-[0.1rem] " />  
                     <span className="hidden lg:block ">Carrinho</span>
                     </li>
                
                <li className=" text-[1.2rem] cursor-pointer hover:text-marieth "
                 onClick={()=>redirecionar("./notificacoes")}> 
                    <IoMdNotificationsOutline className="gap-2   text-[1.4rem] ml-7 mt-[0.1rem]" /> 
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

            
      <div className="lg:hidden">
      <FaBars className="text-2xl mt-2 cursor-pointer hover:bg-marieth" onClick={() => setMenuAberto(!menuAberto)} />
    </div>

    
    {menuAberto && isopen && (
      <div className="absolute top-16 right-2 bg-white border shadow-md p-4 w-[250px] z-[999] rounded-xl">
        <ul className="flex flex-col gap-4">
          <li className="text-[1rem] cursor-pointer hover:text-marieth" onClick={() => redirecionar("./")}>
            <GoHome className="inline mr-2" />
            Início
          </li>
          <li className="text-[1rem] cursor-pointer hover:text-marieth" onClick={() => redirecionar("./carrinho")}>
            <AiOutlineShoppingCart className="inline mr-2" />
            Carrinho
          </li>
          <li className="text-[1rem] cursor-pointer hover:text-marieth" onClick={() => redirecionar("./notificacoes")}>
            <IoMdNotificationsOutline className="inline mr-2" />
            Notificações
          </li>
          <li className="text-[1rem] cursor-pointer hover:text-marieth" onClick={() => redirecionar("./relatoriocomprador")}>
            <BiBarChartSquare className="inline mr-2" />
            Relatórios
          </li>
          <li className="text-[1rem] cursor-pointer hover:text-marieth" onClick={() => redirecionar()}>
            <IoPersonCircleOutline className="inline mr-2" />
            Minha conta
          </li>
          <li className="text-[1rem] cursor-pointer hover:text-vermelho" onClick={handleLogout}>
            <IoPersonCircleOutline className="inline mr-2" />
            Terminar Sessão
          </li>
        </ul>
      </div>
    )}

        </nav>



    )

}